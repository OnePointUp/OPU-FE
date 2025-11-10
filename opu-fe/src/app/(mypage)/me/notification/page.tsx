"use client";

import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";

export default function NotificationPage() {
    return (
        <div className="flex flex-col min-h-[100svh]">
            <Header title="알림 설정" show={true} showBack />

            <Menu />
        </div>
    );
}
