"use client";

import { useCallback, useEffect } from "react";
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
        if (e.type === "connect") {
            console.log("[SSE] connected");
            return;
        }
        if (e.type === "ping") return;

        if (e.type === "notification") {
            console.log("[SSE] notification", e.data);
            emitNotificationIncoming(e.data);
            toastInfo(e.data.title ?? "알림이 도착했습니다!");
        }
    }, []);

    const { state } = useNotificationSse<NotificationResponse>({
        enabled: true,
        onEvent,
        onError: (err) => console.warn("[SSE] error", err),
    });

    useEffect(() => {
        console.log("[SSE] state:", state);
    }, [state]);

    return null;
}
