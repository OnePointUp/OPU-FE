import { NextResponse } from "next/server";
import type {
    NotificationSettings,
    NotificationKey,
} from "@/features/notification/types";

const Mock: NotificationSettings = {
    allEnabled: true,
    sections: [
        {
            id: "base",
            type: "기본 알림",
            items: [
                {
                    key: "morning",
                    label: "아침 알림",
                    description: "매일 오전 08:00 발송",
                    enabled: true,
                },
                {
                    key: "evening",
                    label: "저녁 알림",
                    description: "매일 오후 08:00 발송",
                    enabled: false,
                },
            ],
        },
        {
            id: "exec",
            type: "수행 관련 알림",
            items: [
                {
                    key: "routine",
                    label: "루틴",
                    description: "다음 주 루틴, 일요일 저녁에 미리 준비하세요~",
                    enabled: true,
                },
                {
                    key: "todo",
                    label: "투두리스트",
                    description: "할 일 시작 10분 전에 미리 알려드려요!",
                    enabled: true,
                },
                {
                    key: "random",
                    label: "랜덤 뽑기",
                    description: "하루의 시작, 오전 9시 랜덤 뽑기 알림!",
                    enabled: false,
                },
            ],
        },
    ],
};

function recomputeAllEnabled(s: NotificationSettings) {
    const anyOn = s.sections.some((sec) => sec.items.some((it) => it.enabled));
    s.allEnabled = anyOn;
}

export async function GET() {
    await new Promise((r) => setTimeout(r, 120));
    return NextResponse.json(Mock);
}

type PatchBodyAll = { key: "ALL"; enabled: boolean };
type PatchBodyOne = { key: NotificationKey; enabled: boolean };
type PatchBody = PatchBodyAll | PatchBodyOne;

export async function PATCH(req: Request) {
    const body: PatchBody = await req.json();

    if (body.key === "ALL") {
        Mock.sections = Mock.sections.map((sec) => ({
            ...sec,
            items: sec.items.map((it) => ({ ...it, enabled: body.enabled })),
        }));
        recomputeAllEnabled(Mock);
        await new Promise((r) => setTimeout(r, 120));
        return NextResponse.json(Mock);
    }

    Mock.sections = Mock.sections.map((sec) => ({
        ...sec,
        items: sec.items.map((it) =>
            it.key === body.key ? { ...it, enabled: body.enabled } : it
        ),
    }));

    recomputeAllEnabled(Mock);
    await new Promise((r) => setTimeout(r, 120));
    return NextResponse.json(Mock);
}
