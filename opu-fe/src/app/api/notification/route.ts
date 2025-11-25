import { NextResponse } from "next/server";
import type {
    NotificationSettings,
    NotificationCode,
} from "@/features/notification/types";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import {
    notificationTypes,
    type NotificationTypeRow,
} from "@/mocks/api/db/notification-type.db";
import {
    memberNotificationSettings,
    updateAllForMember,
    upsertOneForMember,
} from "@/mocks/api/db/member_notification_setting.db";

// NotificationSettings 응답으로 변환
function buildSettingsForMember(memberId: number): NotificationSettings {
    const baseKeys: NotificationCode[] = ["MORNING", "EVENING"];
    const execKeys: NotificationCode[] = ["ROUTINE", "TODO", "RANDOM"];

    const findTypeByKey = (code: NotificationCode): NotificationTypeRow =>
        notificationTypes.find((t) => t.code === code)!;

    const findSetting = (typeId: number) =>
        memberNotificationSettings.find(
            (s) => s.member_id === memberId && s.notification_type_id === typeId
        );

    const makeItem = (code: NotificationCode) => {
        const type = findTypeByKey(code);
        const setting = findSetting(type.id);
        const enabled = setting ? setting.enabled : type.default_enabled;

        return {
            code,
            label: type.name,
            description: type.description,
            enabled,
        };
    };

    const sections = [
        {
            id: "base",
            type: "기본 알림",
            items: baseKeys.map(makeItem),
        },
        {
            id: "exec",
            type: "수행 관련 알림",
            items: execKeys.map(makeItem),
        },
    ];

    const anyOn = sections.some((sec) =>
        sec.items.some((item) => item.enabled)
    );

    return {
        allEnabled: anyOn,
        sections,
    };
}

async function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function GET() {
    const settings = buildSettingsForMember(CURRENT_MEMBER_ID);
    await delay(120);
    return NextResponse.json(settings);
}

type PatchBodyAll = { code: "ALL"; enabled: boolean };
type PatchBodyOne = { code: NotificationCode; enabled: boolean };
type PatchBody = PatchBodyAll | PatchBodyOne;

export async function PATCH(req: Request) {
    const body: PatchBody = await req.json();

    // 전체 ON/OFF
    if (body.code === "ALL") {
        updateAllForMember(CURRENT_MEMBER_ID, body.enabled);

        const settings = buildSettingsForMember(CURRENT_MEMBER_ID);
        await delay(120);
        return NextResponse.json(settings);
    }

    // 개별 토글
    const type = notificationTypes.find((t) => t.code === body.code);

    if (type) {
        upsertOneForMember(CURRENT_MEMBER_ID, type.id, body.enabled);
    }

    const settings = buildSettingsForMember(CURRENT_MEMBER_ID);
    await delay(120);
    return NextResponse.json(settings);
}
