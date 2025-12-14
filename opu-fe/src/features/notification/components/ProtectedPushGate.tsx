"use client";

import { useEffect, useState } from "react";
import {
    fetchWebPushStatus,
    updateWebPushAgreed,
} from "@/features/notification/services";
import WebPushModal from "./WebPushModal";

const KEY = "opu_push_prompt_v1";

export default function ProtectedPushGate() {
    const [open, setOpen] = useState(false);
    const permission: NotificationPermission =
        typeof window === "undefined" ? "default" : Notification.permission;

    useEffect(() => {
        (async () => {
            const status = await fetchWebPushStatus();

            if (status.webPushAgreed) {
                localStorage.setItem(KEY, "1");
                return;
            }

            if (localStorage.getItem(KEY) === "1") return;

            setOpen(true);
        })();
    }, []);

    const close = () => {
        localStorage.setItem(KEY, "1");
        setOpen(false);
    };

    const onLater = close;

    const onAccept = async () => {
        // denied는 브라우저가 막은 상태라 여기서 못 바꿈, 안내만 하고 닫기
        if (Notification.permission === "denied") {
            localStorage.setItem(KEY, "1");
            setOpen(false);
            return;
        }

        const p =
            Notification.permission === "default"
                ? await Notification.requestPermission()
                : Notification.permission;

        if (p !== "granted") {
            localStorage.setItem(KEY, "1");
            setOpen(false);
            return;
        }

        await updateWebPushAgreed(true);

        localStorage.setItem(KEY, "1");
        setOpen(false);
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
