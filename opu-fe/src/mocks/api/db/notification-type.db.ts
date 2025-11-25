import type { NotificationCode } from "@/features/notification/types";

const nowIso = () => new Date().toISOString();

export type NotificationTypeRow = {
    id: number;
    code: NotificationCode;
    name: string;
    description: string;
    default_enabled: boolean;
    default_time: string | null;
    created_at: string;
    updated_at: string | null;
};

export const notificationTypes: NotificationTypeRow[] = [
    {
        id: 1,
        code: "MORNING",
        name: "아침 알림",
        description:
            "매일 오전 8시에 오늘의 루틴과 할 일을 가볍게 상기시켜 드려요.",
        default_enabled: true,
        default_time: "08:00",
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 2,
        code: "EVENING",
        name: "저녁 알림",
        description:
            "하루를 마무리하며 오늘의 기록과 내일 루틴을 정리할 수 있도록 알려드려요.",
        default_enabled: false,
        default_time: "20:00",
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 3,
        code: "ROUTINE",
        name: "루틴",
        description:
            "다가오는 주에 예정된 루틴을 일요일 저녁에 한 번에 모아 알려드려요.",
        default_enabled: true,
        default_time: "18:00",
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 4,
        code: "TODO",
        name: "투두리스트",
        description:
            "설정해 둔 시작 시간 기준으로, 할 일 10분 전에 미리 준비할 수 있도록 알려드려요.",
        default_enabled: true,
        default_time: null,
        created_at: nowIso(),
        updated_at: null,
    },
    {
        id: 5,
        code: "RANDOM",
        name: "랜덤 뽑기",
        description:
            "매일 오전 9시, 오늘의 랜덤 OPU를 뽑을 수 있도록 알림을 보내드려요.",
        default_enabled: false,
        default_time: "09:00",
        created_at: nowIso(),
        updated_at: null,
    },
];
