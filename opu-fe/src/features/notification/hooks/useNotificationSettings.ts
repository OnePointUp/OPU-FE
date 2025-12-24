"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchNotificationSettings,
    patchNotificationItem,
    setAllNotifications,
    subscribeWebPush,
    unsubscribeWebPush,
    updateWebPushAgreed,
} from "@/features/notification/services";
import type {
    NotificationSettingsView,
    NotificationCode,
} from "@/features/notification/types";
import { toastError } from "@/lib/toast";

function urlBase64ToUint8Array(base64String: string) {
    const clean = (base64String || "").trim().replace(/\s+/g, "");
    const padding = "=".repeat((4 - (clean.length % 4)) % 4);
    const base64 = (clean + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const out = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) out[i] = rawData.charCodeAt(i);
    return out;
}

export function useNotificationSettings() {
    const [view, setView] = useState<NotificationSettingsView | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        const data = await fetchNotificationSettings();
        setView(data);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                await refresh();
            } catch (e) {
                console.error(e);
                toastError("알림 설정을 불러오지 못했어요.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [refresh]);

    // 웹푸시 허용 ON/OFF (+ 구독/해제 API 호출)
    const toggleWebPushAgreed = useCallback(
        async (agreed: boolean) => {
            try {
                setView((prev) => {
                    if (!prev) return prev;
                    return { ...prev, webPushAgreed: agreed };
                });

                if (agreed) {
                    if (
                        typeof window === "undefined" ||
                        !("Notification" in window) ||
                        !("serviceWorker" in navigator) ||
                        !("PushManager" in window)
                    ) {
                        throw new Error(
                            "웹 푸시를 지원하지 않는 브라우저예요."
                        );
                    }

                    if (Notification.permission !== "granted") {
                        throw new Error(
                            "알림 권한을 허용해야 웹푸시를 켤 수 있어요."
                        );
                    }

                    const vapidPublicKey =
                        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                    if (!vapidPublicKey) {
                        throw new Error("웹푸시 키가 설정되지 않았어요.");
                    }

                    const reg =
                        (await navigator.serviceWorker.getRegistration("/")) ??
                        (await navigator.serviceWorker.register(
                            "/service-worker.js",
                            { scope: "/" }
                        ));

                    await navigator.serviceWorker.ready;

                    let sub = await reg.pushManager.getSubscription();
                    if (!sub) {
                        sub = await reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey:
                                urlBase64ToUint8Array(vapidPublicKey),
                        });
                    }

                    const json = sub.toJSON();
                    const endpoint = sub.endpoint;
                    const p256dh = json.keys?.p256dh ?? "";
                    const auth = json.keys?.auth ?? "";
                    const expirationTime = sub.expirationTime ?? null;

                    if (!endpoint || !p256dh || !auth) {
                        throw new Error("푸시 구독 정보가 올바르지 않아요.");
                    }

                    await subscribeWebPush({
                        endpoint,
                        p256dh,
                        auth,
                        expirationTime,
                    });
                } else {
                    const reg = await navigator.serviceWorker.getRegistration(
                        "/"
                    );
                    const sub = await reg?.pushManager.getSubscription();
                    const endpoint = sub?.endpoint;

                    if (endpoint) {
                        await unsubscribeWebPush({ endpoint });
                    }

                    try {
                        await sub?.unsubscribe();
                    } catch (err) {
                        console.error(err);
                    }
                }

                await updateWebPushAgreed(agreed);
            } catch (e) {
                console.error(e);
                toastError(
                    e instanceof Error ? e.message : "저장에 실패했어요."
                );

                try {
                    await refresh();
                } catch {
                    // 무시
                }
            }
        },
        [refresh]
    );

    // 전체 ON/OFF
    const toggleAll = useCallback(
        async (enabled: boolean) => {
            setView((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        allEnabled: enabled,
                        sections: prev.settings.sections.map((sec) => ({
                            ...sec,
                            items: sec.items.map((it) => ({
                                ...it,
                                enabled,
                            })),
                        })),
                    },
                };
            });

            try {
                await setAllNotifications(enabled);
            } catch (e) {
                console.error(e);
                toastError("저장에 실패했어요.");

                try {
                    await refresh();
                } catch {
                    // 무시
                }
            }
        },
        [refresh]
    );

    // 개별 ON/OFF
    const toggleOne = useCallback(
        async (code: NotificationCode, enabled: boolean) => {
            setView((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    settings: {
                        ...prev.settings,
                        sections: prev.settings.sections.map((sec) => ({
                            ...sec,
                            items: sec.items.map((it) =>
                                it.code === code ? { ...it, enabled } : it
                            ),
                        })),
                    },
                };
            });

            try {
                await patchNotificationItem(code, enabled);
            } catch (e) {
                console.error(e);
                toastError("저장에 실패했어요.");

                try {
                    await refresh();
                } catch {
                    // 무시
                }
            }
        },
        [refresh]
    );

    return {
        view,
        settings: view?.settings ?? null,
        webPushAgreed: view?.webPushAgreed ?? false,
        loading,
        refresh,
        toggleWebPushAgreed,
        toggleAll,
        toggleOne,
    };
}
