import { requestJSON } from "@/lib/request";
import type {
    NotificationSettings,
    NotificationCode,
    NotificationFeedItem,
} from "./types";

const SETTINGS_BASE = "/notification";
const FEED_BASE = "/notification/feed";

// ===== 알림 설정 =====
export function fetchNotificationSettings() {
    return requestJSON<NotificationSettings>(SETTINGS_BASE);
}

export function patchNotificationItem(code: NotificationCode, enabled: boolean) {
    return requestJSON<NotificationSettings>(SETTINGS_BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, enabled }),
    });
}

export function setAllNotifications(enabled: boolean) {
    return requestJSON<NotificationSettings>(SETTINGS_BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ALL", enabled }),
    });
}

// ===== 알림 목록 =====
export async function fetchNotificationFeed() {
    return requestJSON<NotificationFeedItem[]>(FEED_BASE);
}

// 알림 모두 읽음
export async function readAllNotificationFeed() {
    return requestJSON<NotificationFeedItem[]>(FEED_BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ALL_READ" }),
    });
}

// 개별 알림 읽음
export function readOneNotificationFeed(id: number) {
    return requestJSON<NotificationFeedItem[]>(FEED_BASE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ONE_READ", id }),
    });
}
