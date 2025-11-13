"use client";

import { useEffect, useState } from "react";
import UserInfo from "@/features/user/components/UserInfo";
import SettingsList from "@/features/user/components/SettingsList";
import Header from "@/components/layout/Header";
import { fetchMyProfile, type UserProfile } from "@/features/user/services";
import Menu from "@/components/layout/Menu";
import { useRouter } from "next/navigation";

export default function MyPage() {
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const items = [
        { label: "차단 OPU 관리", href: "/me/blocked-opu" },
        { label: "알림 설정", href: "/me/notification" },
        { label: "비밀번호 변경", href: "/me/password" },
        { label: "로그아웃", onClick: () => console.log("로그아웃!") },
    ];

    useEffect(() => {
        fetchMyProfile()
            .then(setProfile)
            .catch((err) => console.error("프로필 불러오기 실패: ", err))
            .finally(() => setLoading(false));
    }, []);

    function handleEdit() {
        router.push("/me/profile");
    }

    return (
        <div className="app-page overflow-hidden ">
            <Header title="마이페이지" showBack={false} />

            <main className="app-container pt-app-header pb-40">
                <UserInfo
                    nickname={profile?.nickname ?? ""}
                    email={profile?.email ?? ""}
                    bio={profile?.bio}
                    profileImageUrl={profile?.profileImageUrl}
                    handleEdit={handleEdit}
                    loading={loading}
                />

                <div className="w-full">
                    <SettingsList items={items} />
                </div>
            </main>

            <Menu />
        </div>
    );
}
