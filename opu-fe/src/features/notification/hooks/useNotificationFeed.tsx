"use client";

import { useCallback, useEffect, useState } from "react";
import type { NotificationFeedItem } from "../types";
import {
    fetchNotificationFeed,
    readAllNotifications,
    readOneNotification,
} from "../services";

export function useNotificationFeed() {
    const [items, setItems] = useState<NotificationFeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchNotificationFeed();
                setItems(data);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const reload = useCallback(async () => {
        const data = await fetchNotificationFeed();
        setItems(data);
    }, []);

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
