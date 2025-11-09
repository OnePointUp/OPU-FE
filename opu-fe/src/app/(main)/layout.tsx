"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";

const HIDE_HEADER = new Set(["/login", "/splash", "/intro"]);

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const showHeader = !HIDE_HEADER.has(pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {/* 테스트용 헤더 렌더링 : 실제 페이지 만든 후에 title명 변경, show={showHeader}로 바꾸기*/}
            <Header title="회원가입" show={true} showBack />
            <main className="flex-1">{children}</main>
            <Menu />
        </div>
    );
}
