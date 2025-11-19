"use client";

import Header from "@/components/layout/Header";
import MyPage from "@/features/user/pages/MyPage";

export default function Page() {
    return (
        <div>
            <Header title="마이페이지" />
            <MyPage />
        </div>
    );
}
