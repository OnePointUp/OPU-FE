"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import {
    getHeaderConfig,
    type Tooltip,
} from "@/components/layout/headerConfig";
import { fetchNotificationFeed } from "@/features/notification/services";
import { NotificationFeedItem } from "@/features/notification/types";

type Props = {
    titleOverride?: string;
    show?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    tooltipOverride?: Tooltip;
};

const NOTIFICATION_DISABLED_PATHS = [
    "/login",
    "/find-pw",
    "/social-signup",
    "/signup",
    "/signup/check-email",
    "/signup/email-confirmed",
    "/find-pw/email-confirmed",
];

export default function Header({
    titleOverride,
    show = true,
    showBack,
    onBack,
    tooltipOverride,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [visible, setVisible] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const { title, tooltip, hide, defaultShowBack } = getHeaderConfig(
        pathname,
        searchParams
    );
    const handleBack = () => {
        if (onBack) return onBack();
        router.back();
    };

    const handleGoNotification = () => {
        router.push("/notification");
    };

    const notificationEnabled = !NOTIFICATION_DISABLED_PATHS.includes(pathname);

    useEffect(() => {
        if (!notificationEnabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasUnread(false);
            return;
        }

        async function loadUnread() {
            try {
                const items: NotificationFeedItem[] =
                    await fetchNotificationFeed();
                setHasUnread(items.some((item) => !item.read));
            } catch {
                setHasUnread(false);
            }
        }

        loadUnread();
    }, [pathname, notificationEnabled]);

    if (!show || hide) return null;

    const finalTitle = titleOverride ?? title;
    const finalTooltip = tooltipOverride ?? tooltip;
    const backVisible = showBack ?? defaultShowBack;
    const showNotificationIcon =
        notificationEnabled && pathname !== "/notification";

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {backVisible ? (
                    <button
                        className="app-header__icon"
                        aria-label="뒤로가기"
                        onClick={onBack ?? (() => router.back())}
                    >
                        <Icon
                            icon="ic:round-arrow-back-ios-new"
                            width="22"
                            height="22"
                        />
                    </button>
                ) : (
                    <span className="app-header__spacer" />
                )}

                <div className="flex items-center justify-center gap-1 relative">
                    <h1 className="app-header__title">{finalTitle}</h1>

                    {finalTooltip && (
                        <div
                            className="relative group"
                            onMouseEnter={() => setVisible(true)}
                            onMouseLeave={() => setVisible(false)}
                        >
                            <Icon
                                icon="lucide:info"
                                width={16}
                                height={16}
                                style={{
                                    color: "var(--color-light-gray)",
                                    cursor: "pointer",
                                }}
                            />

                            {visible && (
                                <div
                                    className={`absolute z-50 text-center border border-[var(--color-light-gray)] 
                                               bg-[var(--background)] text-[11px] text-[var(--color-dark-gray)] 
                                               rounded-md px-3 py-2 shadow-sm
                                               ${
                                                   finalTooltip.position ===
                                                   "top"
                                                       ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
                                                       : finalTooltip.position ===
                                                         "right"
                                                       ? "left-full ml-2 top-1/2 -translate-y-1/2"
                                                       : "top-full mt-2 left-1/2 -translate-x-1/2"
                                               }`}
                                    style={{
                                        width: "max-content",
                                        maxWidth: "calc(100vw - 32px)",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "keep-all",
                                    }}
                                >
                                    {Array.isArray(finalTooltip.message)
                                        ? finalTooltip.message.join("\n")
                                        : finalTooltip.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {showNotificationIcon ? (
                    <div className="app-header__icon relative flex items-center justify-center">
                        <button
                            type="button"
                            aria-label="알림 보기"
                            onClick={handleGoNotification}
                            className="relative"
                        >
                            <Icon
                                icon="mingcute:notification-line"
                                width={26}
                                height={26}
                            />

                            {hasUnread && (
                                <span className="absolute top-[2px] right-[3px] w-2 h-2 rounded-full bg-[var(--color-like-pink)]" />
                            )}
                        </button>
                    </div>
                ) : (
                    <span className="app-header__spacer" />
                )}
            </div>
        </header>
    );
}
