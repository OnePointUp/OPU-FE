"use client";

import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";

export default function BlockedOpuPage() {
    return (
        <div className="flex flex-col min-h-[100svh]">
            <Header title="차단한 OPU 목록" show={true} showBack />

            <Menu />
        </div>
    );
}
