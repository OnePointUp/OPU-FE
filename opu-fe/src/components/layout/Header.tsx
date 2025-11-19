"use client";

import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState } from "react";
import {
    getHeaderConfig,
    type Tooltip,
} from "@/components/layout/headerConfig";

type Props = {
    titleOverride?: string;
    show?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    tooltipOverride?: Tooltip;
};

export default function Header({
    titleOverride,
    show = true,
    showBack,
    onBack,
    tooltipOverride,
}: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const { title, tooltip, hide, defaultShowBack } = getHeaderConfig(pathname);

    if (!show || hide) return null;

    const finalTitle = titleOverride ?? title;
    const finalTooltip = tooltipOverride ?? tooltip;
    const backVisible = showBack ?? defaultShowBack;

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {backVisible ? (
                    <button
                        className="app-header__back"
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

                <span className="app-header__spacer" />
            </div>
        </header>
    );
}
