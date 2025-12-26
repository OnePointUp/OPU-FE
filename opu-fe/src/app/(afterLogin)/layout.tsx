"use client";

import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import { usePathname } from "next/navigation";

const HIDDEN_MENU_PATHS = [
    "/me/verify-password",
    "/me/profile",
    "/me/notification",
    "/notification",

    "/opu/blocked",
    "/opu/liked",
    "/opu/my",
    "/opu/register",
    "/opu/edit",
    "/opu/random/scope",
    "/opu/random/time",
    "/opu/random/result",

    "/login",
    "/signup",
    "/social-signup",
    "/reset-password",

    "/routine",
    "/routine/register",
    "/routine/edit",
    "/routine/frequency",
] as const;

const shouldHideMenu = (pathname: string) =>
    HIDDEN_MENU_PATHS.some((p) => pathname.startsWith(p));

export default function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const hideMenu = shouldHideMenu(pathname);

    return (
        <div className="app-page">
            <Header />

            <main className="app-container pt-app-header px-6 py-20 overflow-y-auto overflow-x-hidden">
                {children}
            </main>

            {!hideMenu && <Menu />}
        </div>
    );
}
