"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";

const HIDE_PREFIX = ["/login", "/splash", "/intro"];

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const showHeader = !HIDE_PREFIX.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    return (
        <div className="flex flex-col min-h-[100svh]">
            <Header title="홈" show={showHeader} showBack={false} />
            <main className="flex-1">{children}</main>
            <Menu />
        </div>
    );
}
