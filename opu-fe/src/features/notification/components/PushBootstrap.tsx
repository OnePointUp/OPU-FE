"use client";

import { useEffect } from "react";
import { subscribeWebPush } from "@/features/notification/services";

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
        console.log("[PushBootstrap] mounted");

        let cancelled = false;

        (async () => {
            try {
                console.log("[PushBootstrap] start");

                if (!("Notification" in window))
                    return console.log("no Notification");
                if (!("serviceWorker" in navigator))
                    return console.log("no SW");
                if (!("PushManager" in window))
                    return console.log("no PushManager");

                console.log("permission:", Notification.permission);

                let permission: NotificationPermission =
                    Notification.permission;
                if (permission === "default")
                    permission = await Notification.requestPermission();
                console.log("permission(after):", permission);
                if (permission !== "granted") return;

                const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                console.log("vapid key exists:", !!vapidPublicKey);
                if (!vapidPublicKey) return;

                const reg = await navigator.serviceWorker.register(
                    "/service-worker.js",
                    { scope: "/" }
                );
                console.log("sw registered:", reg.scope);

                await navigator.serviceWorker.ready;
                console.log("sw ready");

                let sub = await reg.pushManager.getSubscription();
                console.log("existing sub:", !!sub);

                if (!sub) {
                    sub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey:
                            urlBase64ToUint8Array(vapidPublicKey),
                    });
                    console.log("subscribed new");
                }

                const json = sub.toJSON();
                const endpoint = sub.endpoint;
                const p256dh = json.keys?.p256dh ?? "";
                const auth = json.keys?.auth ?? "";
                const expirationTime = sub.expirationTime ?? null;

                console.log("sub data:", {
                    endpoint: !!endpoint,
                    p256dh: !!p256dh,
                    auth: !!auth,
                });

                if (cancelled) return;
                if (!endpoint || !p256dh || !auth) return;

                await subscribeWebPush({
                    endpoint,
                    p256dh,
                    auth,
                    expirationTime,
                });
                console.log("subscribeWebPush OK");
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
