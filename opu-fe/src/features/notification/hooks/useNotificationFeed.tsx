"use client";

import { useEffect, useState } from "react";
import type { NotificationFeedItem } from "../types";
import { fetchNotificationFeed, readAllNotificationFeed } from "../services";

export function useNotificationFeed() {
    const [items, setItems] = useState<NotificationFeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotificationFeed()
            .then((data) => setItems(data))
            .finally(() => setLoading(false));
    }, []);

    // 개별 읽음 처리
    const markAsRead = async (id: number) => {
        // UI 먼저 업데이트
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, isRead: true } : item
            )
        );

        // 서버로 PATCH 요청 보내기
        await fetch(`/api/notification/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
        });
    };

    // 전체 읽음 처리
    const markAllRead = async () => {
        const updated = await readAllNotificationFeed();
        setItems(updated);
    };

    return { items, loading, markAsRead, markAllRead };
}
