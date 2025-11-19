import type {
    NotificationSettings,
    NotificationKey,
    NotificationFeedItem,
} from "./types";

async function requestJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok)
        throw new Error(await res.text().catch(() => "Request failed"));
    return res.json() as Promise<T>;
}

const BASE = "/api/notification";

// ===== 알림 설정 =====
export function fetchNotificationSettings() {
    return requestJSON<NotificationSettings>(BASE);
}

export function patchNotificationItem(key: NotificationKey, enabled: boolean) {
    return requestJSON<NotificationSettings>(BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, enabled }),
    });
}

export function setAllNotifications(enabled: boolean) {
    return requestJSON<NotificationSettings>(BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ALL", enabled }),
    });
}

// ===== 알림 목록 =====
type NotificationCode = "MORNING" | "EVENING" | "ROUTINE" | "TODO" | "RANDOM";

type NotificationApiItem = {
    id: number | null;
    code: NotificationCode;
    title: string;
    message: string;
    linkedContentId: string | null;
    read: boolean | null;
    createdAt: string;
};

const FEED_BASE = "/api/notification/feed";

// code -> NotificationKey 매핑
const codeToKey: Record<NotificationCode, NotificationKey> = {
    MORNING: "morning",
    EVENING: "evening",
    ROUTINE: "routine",
    TODO: "todo",
    RANDOM: "random",
};

// DTO -> 뷰 모델 변환
function mapNotification(item: NotificationApiItem): NotificationFeedItem {
    return {
        id: item.id ?? 0,
        key: codeToKey[item.code],
        title: item.title,
        message: item.message,
        linkedContentId: item.linkedContentId,
        createdAt: item.createdAt,
        isRead: item.read ?? false,
    };
}

// 알림 목록 조회
export function fetchNotificationFeed() {
    return requestJSON<NotificationApiItem[]>(FEED_BASE).then((rows) =>
        rows.map(mapNotification)
    );
}

// 알림 모두 읽음
export function readAllNotificationFeed() {
    return requestJSON<NotificationApiItem[]>(FEED_BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ALL_READ" }),
    }).then((rows) => rows.map(mapNotification));
}
