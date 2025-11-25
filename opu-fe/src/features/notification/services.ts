import { requestJSON } from "@/lib/request";
import type {
    NotificationSettings,
    NotificationCode,
    NotificationFeedItem,
} from "./types";

const BASE = "/api/notification";

// ===== 알림 설정 =====
export function fetchNotificationSettings() {
    return requestJSON<NotificationSettings>(BASE);
}

export function patchNotificationItem(key: NotificationCode, enabled: boolean) {
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

const FEED_BASE = "/api/notification/feed";

// 알림 목록 조회
export function fetchNotificationFeed() {
    return requestJSON<NotificationFeedItem[]>(FEED_BASE);
}

// 알림 모두 읽음
export function readAllNotificationFeed() {
    return requestJSON<NotificationFeedItem[]>(FEED_BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ALL_READ" }),
    });
}
