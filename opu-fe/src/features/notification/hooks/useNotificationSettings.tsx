"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchNotificationSettings,
    patchNotificationItem,
    setAllNotifications,
    updateWebPushAgreed,
} from "@/features/notification/services";
import type {
    NotificationSettingsView,
    NotificationCode,
} from "@/features/notification/types";
import { toastError } from "@/lib/toast";

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

    // 웹푸시 허용 ON/OFF
    const toggleWebPushAgreed = useCallback(
        async (agreed: boolean) => {
            setView((prev) => {
                if (!prev) return prev;
                return { ...prev, webPushAgreed: agreed };
            });

            try {
                await updateWebPushAgreed(agreed);
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
