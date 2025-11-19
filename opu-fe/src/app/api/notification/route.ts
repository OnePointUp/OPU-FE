import { NextResponse } from "next/server";
import type {
    NotificationSettings,
    NotificationKey,
} from "@/features/notification/types";

// 여기서는 간단하게 단일 유저만 가정
const CURRENT_MEMBER_ID = 1;

type NotificationTypeRow = {
    id: number;
    code: NotificationKey;
    name: string;
    description: string;
    default_enabled: boolean;
    default_time: string | null;
    created_at: string;
    updated_at: string | null;
};

type MemberNotificationSettingRow = {
    id: number;
    member_id: number;
    notification_type_id: number;
    enabled: boolean;
    updated_at: string | null;
};

const nowIso = () => new Date().toISOString();

const notificationTypes: NotificationTypeRow[] = [
    {
        id: 1,
        code: "morning",
        name: "아침 알림",
        description: "매일 오전 08:00 발송",
        default_enabled: true,
        default_time: "08:00",
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 2,
        code: "evening",
        name: "저녁 알림",
        description: "매일 오후 08:00 발송",
        default_enabled: false,
        default_time: "20:00",
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 3,
        code: "routine",
        name: "루틴",
        description: "다음 주 루틴, 일요일 저녁에 미리 준비하세요~",
        default_enabled: true,
        default_time: "18:00",
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 4,
        code: "todo",
        name: "투두리스트",
        description: "할 일 시작 10분 전에 미리 알려드려요!",
        default_enabled: true,
        default_time: null, // 투두는 개별 시간이라 기본 시간 없음
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 5,
        code: "random",
        name: "랜덤 뽑기",
        description: "하루의 시작, 오전 9시 랜덤 뽑기 알림!",
        default_enabled: false,
        default_time: "09:00",
        created_at: nowIso(),
        updated_at: null,
    },
];

// 알림 설정
let memberSettings: MemberNotificationSettingRow[] = notificationTypes.map(
    (type, idx) => ({
        id: idx + 1,
        member_id: CURRENT_MEMBER_ID,
        notification_type_id: type.id,
        enabled: type.default_enabled,
        updated_at: null,
    })
);

// NotificationSettings 응답으로 변환
function buildSettingsForMember(memberId: number): NotificationSettings {
    const baseKeys: NotificationKey[] = ["morning", "evening"];
    const execKeys: NotificationKey[] = ["routine", "todo", "random"];

    const findTypeByKey = (key: NotificationKey) =>
        notificationTypes.find((t) => t.code === key)!;

    const findSetting = (typeId: number) =>
        memberSettings.find(
            (s) => s.member_id === memberId && s.notification_type_id === typeId
        );

    const makeItem = (key: NotificationKey) => {
        const type = findTypeByKey(key);
        const setting = findSetting(type.id);
        const enabled = setting ? setting.enabled : type.default_enabled;

        return {
            key,
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

type PatchBodyAll = { key: "ALL"; enabled: boolean };
type PatchBodyOne = { key: NotificationKey; enabled: boolean };
type PatchBody = PatchBodyAll | PatchBodyOne;

export async function PATCH(req: Request) {
    const body: PatchBody = await req.json();

    // 전체 ON/OFF
    if (body.key === "ALL") {
        memberSettings = memberSettings.map((s) =>
            s.member_id === CURRENT_MEMBER_ID
                ? { ...s, enabled: body.enabled, updated_at: nowIso() }
                : s
        );

        const settings = buildSettingsForMember(CURRENT_MEMBER_ID);
        await delay(120);
        return NextResponse.json(settings);
    }

    // 개별 토글
    const type = notificationTypes.find((t) => t.code === body.key);

    if (type) {
        const idx = memberSettings.findIndex(
            (s) =>
                s.member_id === CURRENT_MEMBER_ID &&
                s.notification_type_id === type.id
        );

        if (idx >= 0) {
            memberSettings[idx] = {
                ...memberSettings[idx],
                enabled: body.enabled,
                updated_at: nowIso(),
            };
        } else {
            // 혹시라도 없으면 새로 insert 된 것처럼 추가
            memberSettings.push({
                id: memberSettings.length + 1,
                member_id: CURRENT_MEMBER_ID,
                notification_type_id: type.id,
                enabled: body.enabled,
                updated_at: nowIso(),
            });
        }
    }

    const settings = buildSettingsForMember(CURRENT_MEMBER_ID);
    await delay(120);
    return NextResponse.json(settings);
}
