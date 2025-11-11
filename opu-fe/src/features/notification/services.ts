import type { NotificationSettings } from "./types";

async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
    return getJSON<NotificationSettings>("/api/notification");
}

export async function saveNotificationSettings(payload: NotificationSettings) {
    const res = await fetch("/api/notification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Save failed");
    return { ok: true };
}
