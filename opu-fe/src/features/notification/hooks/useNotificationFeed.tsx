"use client";

import { useEffect, useState } from "react";
import type { NotificationFeedItem } from "../types";
import {
    fetchNotificationFeed,
    readAllNotificationFeed,
    readOneNotificationFeed,
} from "../services";

export function useNotificationFeed() {
    const [items, setItems] = useState<NotificationFeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotificationFeed()
            .then((data) => setItems(data))
            .finally(() => setLoading(false));
    }, []);

    const markAsRead = async (id: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isRead: true } : item
            )
        );

        try {
            const updated = await readOneNotificationFeed(id);
            setItems(updated);
        } catch (e) {
            // setItems(prev => prev.map(... isRead false로 되돌리기))
            console.error(e);
        }
    };

    const markAllRead = async () => {
        const updated = await readAllNotificationFeed();
        setItems(updated);
    };

    return { items, loading, markAsRead, markAllRead };
}
