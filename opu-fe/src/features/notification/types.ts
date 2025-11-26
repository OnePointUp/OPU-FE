/* 알림 코드 */
export type NotificationCode =
    | "MORNING"
    | "EVENING"
    | "ROUTINE"
    | "TODO"
    | "RANDOM";

/* ===== 알림 설정 ===== */

// DB 타입
export type NotificationType = {
    id: number;
    code: NotificationCode;
    name: string;
    description: string;
    defaultEnabled: boolean;
    defaultTime?: string;
};

// 알림 설정 아이템
export type NotificationItem = {
    code: NotificationCode;
    label: string;
    description: string;
    enabled: boolean;
};

// 섹션 단위 (기본/수행)
export type NotificationSection = {
    id: string;
    type: string;
    items: NotificationItem[];
};

// 멤버별 알림 on/off 설정
export type UserNotificationSetting = {
    notificationTypeId: number;
    code: NotificationCode;
    enabled: boolean;
};

// 전체 응답 모양 - fetchNotificationSettings()
export type NotificationSettings = {
    allEnabled: boolean;
    sections: NotificationSection[];
};

/* ===== 알림 목록 조회 ===== */
export type NotificationFeedItem = {
    id: number;
    code: NotificationCode;
    title: string;
    message: string;
    linkedContentId?: number | null;
    isRead: boolean;
    createdAt: string;
};
