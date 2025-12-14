"use client";

import { useCallback } from "react";
import { SseEvent, useNotificationSse } from "../hooks/useNotificationSSE";
import { emitNotificationIncoming } from "../utils/notificationEvents";
import { toastInfo } from "@/lib/toast";

type NotificationResponse = {
    id: number | null;
    code: string;
    title: string;
    message: string | null;
    linkedContentId?: number | null;
    createdAt: string;
};

export default function NotificationSseBootstrap() {
    const onEvent = useCallback((e: SseEvent<NotificationResponse>) => {
        if (e.type === "connect") return;
        if (e.type === "ping") return;

        if (e.type === "notification") {
            emitNotificationIncoming(e.data);
            toastInfo(e.data.title ?? "알림이 도착했습니다!");
        }
    }, []);

    useNotificationSse<NotificationResponse>({
        enabled: true,
        onEvent,
        onError: () => {},
    });

    return null;
}
