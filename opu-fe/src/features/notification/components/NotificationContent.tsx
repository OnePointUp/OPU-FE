"use client";

import { useCallback, useMemo, useState } from "react";
import Toggle from "@/components/common/Toggle";
import { useNotificationSettings } from "@/features/notification/hooks/useNotificationSettings";
import NotificationToggleRow from "./NotificationToggleRow";
import NotificationToggleList from "./NotificationToggleList";

export default function NotificationContent() {
    const {
        settings,
        webPushAgreed,
        toggleWebPushAgreed,
        loading,
        toggleAll,
        toggleOne,
    } = useNotificationSettings();

    const [pushSaving, setPushSaving] = useState(false);

    const permission = useMemo(() => {
        if (typeof window === "undefined") return "default" as const;
        return Notification.permission;
    }, []);

    const pushDisabled = permission === "denied";

    const pushDescription = pushDisabled
        ? "브라우저 설정에서 알림 권한을 허용해야 받을 수 있어요"
        : webPushAgreed && permission === "granted"
        ? "허용됨 · 브라우저 알림으로 바로 받을 수 있어요"
        : "꺼짐 · 켜면 브라우저 알림으로 받을 수 있어요";

    const onToggleWebPush = useCallback(
        async (next: boolean) => {
            if (pushSaving) return;

            // 켜기: 브라우저 권한 요청
            if (next) {
                if (typeof window !== "undefined") {
                    const p =
                        Notification.permission === "default"
                            ? await Notification.requestPermission()
                            : Notification.permission;

                    if (p !== "granted") return;
                }
            }

            setPushSaving(true);
            try {
                await toggleWebPushAgreed(next);
            } finally {
                setPushSaving(false);
            }
        },
        [pushSaving, toggleWebPushAgreed]
    );

    if (loading || !settings) {
        return <div className="px-2" />;
    }

    return (
        <div>
            {/* 웹푸시 허용 */}
            <div className="flex items-center justify-between -mt-2">
                <div className="flex flex-col gap-1">
                    <span
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        웹 푸시 알림
                    </span>

                    <span className="text-xs text-[var(--color-dark-gray)]">
                        {pushDescription}
                    </span>
                </div>

                <Toggle
                    checked={webPushAgreed && permission === "granted"}
                    onChange={onToggleWebPush}
                    disabled={pushDisabled || pushSaving}
                />
            </div>

            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6 mt-3" />

            {/* 전체 알림 */}
            <div className="flex h-8 items-center justify-between mt-3">
                <span
                    style={{
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "var(--text-sub)",
                    }}
                >
                    전체 알림
                </span>
                <Toggle checked={settings.allEnabled} onChange={toggleAll} />
            </div>

            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6 mt-3" />

            {settings.sections.map((section) => (
                <NotificationToggleList key={section.id} title={section.type}>
                    {section.items.map((item) => (
                        <NotificationToggleRow
                            key={item.code}
                            label={item.label}
                            description={item.description}
                            checked={item.enabled}
                            onChange={(v) => toggleOne(item.code, v)}
                        />
                    ))}
                </NotificationToggleList>
            ))}
        </div>
    );
}
