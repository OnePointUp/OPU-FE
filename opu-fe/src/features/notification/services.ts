import { apiClient } from "@/lib/apiClient";
import { extractErrorMessage } from "@/utils/api-helpers";
import type {
    NotificationSettings,
    NotificationCode,
    NotificationSettingItem,
    NotificationSection,
    NotificationItem,
    NotificationFeedItem,
} from "./types";

const BASE = "/notifications";

const ALL_CODES: NotificationCode[] = [
    "MORNING",
    "EVENING",
    "ROUTINE",
    "RANDOM_PICK",
];

function toNotificationItem(src: NotificationSettingItem): NotificationItem {
    return {
        code: src.code,
        label: src.name,
        description: src.description,
        enabled: src.enabled,
    };
}

function buildSections(list: NotificationSettingItem[]): NotificationSettings {
    const allEnabled = list.length > 0 && list.every((it) => it.enabled);

    const basicCodes: NotificationCode[] = ["MORNING", "EVENING"];
    const execCodes: NotificationCode[] = ["ROUTINE", "RANDOM_PICK"];

    const sections: NotificationSection[] = [
        {
            id: "BASIC",
            type: "기본 알림",
            items: list
                .filter((it) => basicCodes.includes(it.code))
                .map(toNotificationItem),
        },
        {
            id: "EXEC",
            type: "수행 관련 알림",
            items: list
                .filter((it) => execCodes.includes(it.code))
                .map(toNotificationItem),
        },
    ];

    return {
        allEnabled,
        sections,
    };
}

/* ===== 알림 설정 전체 조회 ===== */
export async function fetchNotificationSettings(): Promise<NotificationSettings> {
    try {
        const res = await apiClient.get<{
            success: boolean;
            data: NotificationSettingItem[];
        }>(`${BASE}/settings`);

        const list = res.data.data;
        return buildSections(list);
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "알림 설정을 불러오지 못했어요.")
        );
    }
}

/* ===== 개별 설정 On/Off ===== */
export async function patchNotificationItem(
    code: NotificationCode,
    enabled: boolean
): Promise<void> {
    try {
        await apiClient.patch(`${BASE}/settings/${code}`, { enabled });
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "알림 설정 변경에 실패했어요.")
        );
    }
}

/* ===== 전체 on/off ===== */
export async function setAllNotifications(enabled: boolean): Promise<void> {
    try {
        await Promise.all(
            ALL_CODES.map((code) =>
                apiClient.patch(`${BASE}/settings/${code}`, { enabled })
            )
        );
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "알림 전체 설정 변경에 실패했어요.")
        );
    }
}

/* ===== 알림 목록 조회 ===== */
export async function fetchNotificationFeed(
    onlyUnread = false,
    page = 0,
    size = 20
): Promise<NotificationFeedItem[]> {
    try {
        const res = await apiClient.get(BASE, {
            params: { onlyUnread, page, size },
        });

        return res.data.data.content;
    } catch (err) {
        throw new Error(extractErrorMessage(err, "알림 목록 불러오기 실패"));
    }
}

/* ===== 개별 알림 읽음 ===== */
export async function readOneNotification(
    notificationId: number
): Promise<void> {
    try {
        await apiClient.patch(`${BASE}/${notificationId}/read`);
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "알림을 읽음 처리하지 못했어요.")
        );
    }
}

/* ===== 전체 알림 읽음 ===== */
export async function readAllNotifications(): Promise<void> {
    try {
        await apiClient.patch(`${BASE}/read-all`);
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "전체 알림 읽음 처리에 실패했어요.")
        );
    }
}
