"use client";

import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";

export default function PasswordPage() {
    return (
        <div className="flex flex-col min-h-[100svh]">
            <Header title="비밀번호 변경" show={true} showBack />

            <Menu />
        </div>
    );
}
