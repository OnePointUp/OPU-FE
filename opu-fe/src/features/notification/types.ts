/* ======= 알림 코드 ======= */
export type NotificationCode =
    | "MORNING"
    | "EVENING"
    | "ROUTINE"
    | "RANDOM_PICK";

/* ===== 백엔드 서버 구조 ===== */
export type NotificationSettingItem = {
    typeId: number;
    code: NotificationCode;
    name: string;
    description: string;
    enabled: boolean;
    defaultTime: string | null;
};

/* ===== 화면에서 쓰는 아이템 / 섹션 구조 ===== */
export type NotificationItem = {
    code: NotificationCode;
    label: string;
    description: string;
    enabled: boolean;
};

export type NotificationSection = {
    id: string;
    type: string;
    items: NotificationItem[];
};

/* ===== 전체 설정 ===== */
export type NotificationSettings = {
    allEnabled: boolean;
    sections: NotificationSection[];
};

/* ===== 알림 조회 아이템 ===== */
export type NotificationFeedItem = {
    id: number;
    code: NotificationCode;
    title: string;
    message: string;
    linkedContentId?: number | null;
    read: boolean;
    createdAt: string;
};
