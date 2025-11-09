"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

type Props = {
    title?: string;
    show?: boolean;
    showBack?: boolean;
    onBack?: () => void;
};

export default function Header({
    title = "",
    show = true,
    showBack = true,
    onBack,
}: Props) {
    const router = useRouter();
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

                <h1 className="app-header__title">{title}</h1>

                <span className="app-header__spacer" />
            </div>
        </header>
    );
}
