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
        "/login",
        "/signup",
        "/social-signup",
    ];

    const hideMenu = HIDDEN_MENU_PATHS.some((p) => pathname.startsWith(p));

    return (
        <div className="app-page flex flex-col">
            <Header />
            <main className="app-container pt-app-header pb-40">
                {children}
            </main>

            {!hideMenu && <Menu />}
        </div>
    );
}
