"use client";

import { useEffect, useState } from "react";
import UserInfo from "@/features/user/components/UserInfo";
import SettingsList from "@/features/user/components/SettingsList";
import Header from "@/components/layout/Header";
import { fetchMyProfile, type UserProfile } from "@/features/user/services";
import Menu from "@/components/layout/Menu";

export default function MyPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const items = [
        { label: "차단한 OPU 관리", href: "/me/blocked-opu" },
        { label: "알림 설정", href: "/me/notification" },
        { label: "비밀번호 변경", href: "/me/password" },
        { label: "로그아웃", onClick: () => console.log("로그아웃!") },
    ];

    useEffect(() => {
        fetchMyProfile()
            .then(setProfile)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center bg-[var(--background)]">
            {/* 헤더 */}
            <Header title="마이페이지" showBack={false} />

            <main
                className="w-full flex flex-col items-center"
                style={{
                    paddingTop: "calc(56px + var(--safe-top) + 10px)",
                }}
            >
                {/* 상단 사용자 정보 */}
                <UserInfo
                    nickname={profile?.nickname ?? ""}
                    email={profile?.email ?? ""}
                    introduction={profile?.introduction}
                    profileImageUrl={profile?.profileImageUrl}
                    handleEdit={() => console.log("프로필 편집 이동")}
                    className="mt-4"
                    loading={loading}
                />

                {/* 하단 설정 리스트 */}
                <div className="w-full">
                    <SettingsList items={items} />
                </div>
            </main>

            <Menu />
        </div>
    );
}
