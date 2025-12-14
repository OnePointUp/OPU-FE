import { apiClient } from "@/lib/apiClient";
import { extractErrorMessage } from "@/utils/api-helpers";
import type {
    NotificationSettings,
    NotificationCode,
    NotificationSettingItem,
    NotificationSection,
    NotificationItem,
    NotificationFeedItem,
    WebPushStatusResponse,
    WebPushSubscribePayload,
    WebPushUnsubscribePayload,
    NotificationSettingsApiResponse,
    NotificationSettingsView,
} from "./types";
import { ApiResponse } from "@/types/api";

const BASE = "/notifications";

const ALL_CODES: NotificationCode[] = [
    "MORNING",
    "EVENING",
    "ROUTINE",
    "RANDOM_DRAW",
    "TODO",
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
    const execCodes: NotificationCode[] = ["ROUTINE", "RANDOM_DRAW", "TODO"];

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

function normalizeSettings(
    settings: NotificationSettingItem | NotificationSettingItem[]
): NotificationSettingItem[] {
    return Array.isArray(settings) ? settings : [settings];
}

/* ===== 알림 설정 전체 조회 ===== */
export async function fetchNotificationSettings(): Promise<NotificationSettingsView> {
    const res = await apiClient.get<
        ApiResponse<NotificationSettingsApiResponse>
    >(`${BASE}/settings`);

    const list = normalizeSettings(res.data.data.settings);

    return {
        webPushAgreed: res.data.data.webPushAgreed,
        settings: buildSections(list),
    };
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

/**
 * 웹 푸시 알림
 */

/* ===== Web Push 상태 조회 ===== */
export async function fetchWebPushStatus(): Promise<WebPushStatusResponse> {
    try {
        const res = await apiClient.get<ApiResponse<WebPushStatusResponse>>(
            `${BASE}/push/status`
        );
        return res.data.data;
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "푸시 상태 조회에 실패했어요.")
        );
    }
}

/* ===== 서비스 동의 변경 ===== */
export async function updateWebPushAgreed(agreed: boolean) {
    try {
        await apiClient.patch("/members/me/webpush-agree", {
            agreed,
        });
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "푸시 동의 변경에 실패했어요.")
        );
    }
}

/* ===== 구독 등록 ===== */
export async function subscribeWebPush(payload: WebPushSubscribePayload) {
    try {
        await apiClient.post(`${BASE}/push/subscribe`, payload);
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "푸시 구독 등록에 실패했어요.")
        );
    }
}

/* ===== 구독 해제 ===== */
export async function unsubscribeWebPush(payload: WebPushUnsubscribePayload) {
    try {
        await apiClient.post(`${BASE}/push/unsubscribe`, payload);
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "푸시 구독 해제에 실패했어요.")
        );
    }
}
