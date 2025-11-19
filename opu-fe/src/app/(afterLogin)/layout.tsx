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
        "/opu/blocked",
        "/opu/liked",
        "/me/notification",
        "/login",
        "/signup",
        "/social-signup",
    ];

    const hideMenu = HIDDEN_MENU_PATHS.some((p) => pathname.startsWith(p));

    return (
        <div className="flex flex-col min-h-[100svh]">
            <Header />
            <main className="flex-1">{children}</main>

            {!hideMenu && <Menu />}
        </div>
    );
}
