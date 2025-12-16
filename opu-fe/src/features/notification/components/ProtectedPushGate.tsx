"use client";

import { useEffect, useState } from "react";
import {
    fetchWebPushStatus,
    updateWebPushAgreed,
} from "@/features/notification/services";
import { PUSH_PROMPT_KEY } from "../utils/pushPrompt";
import WebPushModal from "./WebPushModal";

export default function ProtectedPushGate() {
    const [open, setOpen] = useState(false);
    const supportsNotification =
        typeof window !== "undefined" && "Notification" in window;
    const permission: NotificationPermission = supportsNotification
        ? Notification.permission
        : "default";

    useEffect(() => {
        (async () => {
            const status = await fetchWebPushStatus();

            if (status.webPushAgreed) {
                localStorage.setItem(PUSH_PROMPT_KEY, "1");
                return;
            }

            if (localStorage.getItem(PUSH_PROMPT_KEY) === "1") return;

            setOpen(true);
        })();
    }, []);

    const close = () => {
        localStorage.setItem(PUSH_PROMPT_KEY, "1");
        setOpen(false);
    };

    const onLater = close;

    const onAccept = async () => {
        // 브라우저가 알림을 지원하지 않으면 바로 닫기
        if (!supportsNotification) {
            close();
            return;
        }

        // denied는 브라우저가 막은 상태라 여기서 못 바꿈, 안내만 하고 닫기
        if (Notification.permission === "denied") {
            close();
            return;
        }

        const p =
            Notification.permission === "default"
                ? await Notification.requestPermission()
                : Notification.permission;

        if (p !== "granted") {
            close();
            return;
        }

        await updateWebPushAgreed(true);

        close();
    };

    return (
        <WebPushModal
            open={open}
            permission={permission}
            onClose={close}
            onLater={onLater}
            onAccept={onAccept}
        />
    );
}
