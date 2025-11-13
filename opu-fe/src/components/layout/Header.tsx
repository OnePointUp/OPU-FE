"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState } from "react";

type Tooltip = {
    message: string | string[];
    position?: "top" | "bottom" | "right";
};

type Props = {
    title?: string;
    show?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    tooltip?: Tooltip;
};

export default function Header({
    title = "",
    show = true,
    showBack = true,
    onBack,
    tooltip,
}: Props) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    if (!show) return null;

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {showBack ? (
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

                {/* 제목 + 툴팁 */}
                <div className="flex items-center justify-center gap-1 relative">
                    <h1 className="app-header__title">{title}</h1>

                    {tooltip && (
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
                                               rounded-md px-3 py-2 shadow-sm whitespace-nowrap
                                               ${
                                                   tooltip.position === "top"
                                                       ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
                                                       : tooltip.position ===
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
                                    {Array.isArray(tooltip.message)
                                        ? tooltip.message.join("\n")
                                        : tooltip.message}
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
