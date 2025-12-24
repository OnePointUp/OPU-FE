"use client";

import { useEffect } from "react";
import {
    fetchWebPushStatus,
    subscribeWebPush,
} from "@/features/notification/services";

function urlBase64ToUint8Array(base64String: string) {
    const clean = (base64String || "").trim().replace(/\s+/g, "");
    const padding = "=".repeat((4 - (clean.length % 4)) % 4);
    const base64 = (clean + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const out = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) out[i] = rawData.charCodeAt(i);
    return out;
}

export default function PushBootstrap() {
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                if (!("Notification" in window)) return;
                if (!("serviceWorker" in navigator)) return;
                if (!("PushManager" in window)) return;

                const status = await fetchWebPushStatus();
                if (!status.webPushAgreed) return;

                if (Notification.permission !== "granted") return;

                const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!vapidPublicKey) return;

                const reg = await navigator.serviceWorker.register(
                    "/service-worker.js",
                    { scope: "/" }
                );
                await navigator.serviceWorker.ready;

                let sub = await reg.pushManager.getSubscription();
                const hadSub = Boolean(sub);

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

                if (cancelled) return;
                if (!endpoint || !p256dh || !auth) return;

                // 서버/클라이언트 모두 이미 구독 상태면 재등록 생략
                if (hadSub && status.hasSubscription) return;

                await subscribeWebPush({
                    endpoint,
                    p256dh,
                    auth,
                    expirationTime,
                });
            } catch (e) {
                console.warn("[PushBootstrap] failed", e);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return null;
}
