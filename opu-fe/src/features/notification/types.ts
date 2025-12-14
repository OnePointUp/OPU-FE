/**
 * 웹 푸시 알림
 */
export type WebPushStatusResponse = {
    webPushAgreed: boolean;
    hasSubscription: boolean;
};

export type WebPushSubscribePayload = {
    endpoint: string;
    p256dh: string;
    auth: string;
    expirationTime?: number | null;
};

export type WebPushUnsubscribePayload = {
    endpoint: string;
};

/* ======= 알림 코드 ======= */
export type NotificationCode =
    | "MORNING"
    | "EVENING"
    | "ROUTINE"
    | "RANDOM_DRAW"
    | "TODO";

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

export type NotificationSectionId = "BASIC" | "EXEC";

export type NotificationSection = {
    id: NotificationSectionId;
    type: string;
    items: NotificationItem[];
};

export type NotificationSettingsApiResponse = {
    webPushAgreed: boolean;
    settings: NotificationSettingItem | NotificationSettingItem[];
};

export type NotificationSettingsView = {
    webPushAgreed: boolean;
    settings: NotificationSettings;
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
