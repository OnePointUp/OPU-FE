"use client";

import { useCallback, useEffect, useState } from "react";
import type { NotificationFeedItem } from "../types";
import {
    fetchNotificationFeed,
    readAllNotifications,
    readOneNotification,
} from "../services";
import { useAuthStore } from "@/stores/useAuthStore";
import { subscribeNotificationIncoming } from "../utils/notificationEvents";

export function useNotificationFeed() {
    const [items, setItems] = useState<NotificationFeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) return;

        const load = async () => {
            try {
                const data = await fetchNotificationFeed();
                setItems(data);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [accessToken]);

    const reload = useCallback(async () => {
        const data = await fetchNotificationFeed();
        setItems(data);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeNotificationIncoming(() =>
            reload().catch((err) => console.error(err))
        );

        return () => unsubscribe();
    }, [reload]);

    const markAsRead = useCallback(
        async (id: number) => {
            // 낙관적 업데이트
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, read: true } : item
                )
            );

            try {
                await readOneNotification(id);
            } catch (e) {
                console.error(e);
                // 실패 시 다시 동기화
                try {
                    await reload();
                } catch {
                    // 무시
                }
            }
        },
        [reload]
    );

    const markAllRead = useCallback(async () => {
        // 낙관적 업데이트
        setItems((prev) => prev.map((item) => ({ ...item, read: true })));

        try {
            await readAllNotifications();
        } catch (e) {
            console.error(e);
            // 실패 시 다시 동기화
            try {
                await reload();
            } catch {
                // 무시
            }
        }
    }, [reload]);

    return { items, loading, markAsRead, markAllRead };
}
