"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchNotificationSettings,
    patchNotificationItem,
    setAllNotifications,
} from "@/features/notification/services";
import type {
    NotificationSettings,
    NotificationCode,
} from "@/features/notification/types";
import { toastError } from "@/lib/toast";

export function useNotificationSettings() {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchNotificationSettings();
                setSettings(data);
            } catch (e) {
                console.error(e);
                toastError("알림 설정을 불러오지 못했어요.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // 전체 ON/OFF
    const toggleAll = useCallback(async (enabled: boolean) => {
        setSettings((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                allEnabled: enabled,
                sections: prev.sections.map((sec) => ({
                    ...sec,
                    items: sec.items.map((it) => ({
                        ...it,
                        enabled,
                    })),
                })),
            };
        });

        try {
            await setAllNotifications(enabled);
        } catch (e) {
            console.error(e);
            toastError("저장에 실패했어요.");

            try {
                const data = await fetchNotificationSettings();
                setSettings(data);
            } catch {
                // 무시
            }
        }
    }, []);

    // 개별 ON/OFF
    const toggleOne = useCallback(
        async (code: NotificationCode, enabled: boolean) => {
            setSettings((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    sections: prev.sections.map((sec) => ({
                        ...sec,
                        items: sec.items.map((it) =>
                            it.code === code ? { ...it, enabled } : it
                        ),
                    })),
                };
            });

            try {
                await patchNotificationItem(code, enabled);
            } catch (e) {
                console.error(e);
                toastError("저장에 실패했어요.");

                try {
                    const data = await fetchNotificationSettings();
                    setSettings(data);
                } catch {
                    // 무시
                }
            }
        },
        []
    );

    return {
        settings,
        loading,
        toggleAll,
        toggleOne,
    };
}
