export type NotificationKey =
    | "morning"
    | "evening"
    | "routine"
    | "todo"
    | "random";

export type NotificationItem = {
    key: NotificationKey;
    label: string;
    description: string;
    enabled: boolean;
};

export type NotificationType = {
    id: number;
    key: NotificationKey;
    name: string;
    description: string;
    defaultEnabled: boolean;
    defaultTime?: string;
};

export type UserNotificationSetting = {
    notificationTypeId: number;
    key: NotificationKey;
    enabled: boolean;
};

export type NotificationSection = {
    id: string;
    type: string;
    items: NotificationItem[];
};

export type NotificationSettings = {
    allEnabled: boolean;
    sections: NotificationSection[];
};

/* === 알림 목록 조회 === */
export type NotificationFeedItem = {
    id: number;
    key: NotificationKey;
    title: string;
    message?: string;
    linkedContentId?: string | null;
    createdAt: string;
    isRead: boolean;
};
