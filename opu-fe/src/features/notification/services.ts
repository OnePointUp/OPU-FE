import type { NotificationSettings, NotificationKey } from "./types";

async function requestJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok)
        throw new Error(await res.text().catch(() => "Request failed"));
    return res.json() as Promise<T>;
}

const BASE = "/api/notification";

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
