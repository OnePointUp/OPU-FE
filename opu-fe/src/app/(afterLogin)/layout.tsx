"use client";

import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import { usePathname } from "next/navigation";

export default function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const HIDDEN_MENU_PATHS = [
        "/me/password",
        "/me/password/new",
        "/me/profile",
        "/me/notification",
        "/notification",
        "/opu/blocked",
        "/opu/register",
        "/opu/edit",
        "/opu/random/scope",
        "/opu/random/time",
        "/opu/random/result",
        "/login",
        "/signup",
        "/social-signup",
    ];

    const hideMenu = HIDDEN_MENU_PATHS.some((p) => pathname.startsWith(p));

    const bottomOffset = hideMenu ? 0 : 55;

    return (
        <div className="app-page">
            <Header />

            <main
                className={`
                    app-container pt-app-header px-6 py-20
                    overflow-y-auto overflow-x-hidden
                `}
                style={{
                    maxHeight: `calc(100dvh - var(--app-header-h) - ${bottomOffset}px)`,
                }}
            >
                {children}
            </main>

            {!hideMenu && <Menu />}
        </div>
    );
}
