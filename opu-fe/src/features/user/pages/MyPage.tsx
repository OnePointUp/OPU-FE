"use client";

import { useRouter } from "next/navigation";
import UserInfo from "@/features/user/components/UserInfo";
import SettingsList from "@/features/user/components/SettingsList";
import Menu from "@/components/layout/Menu";
import { useMyProfile } from "../hooks/useMyProfile";
import { myPageMenuItems } from "../constants/mePageMenu";

export default function MyPageScreen() {
    const router = useRouter();
    const { profile, loading } = useMyProfile();

    const items = myPageMenuItems;

    function handleEdit() {
        router.push("/me/profile");
    }

    return (
        <div className="app-page overflow-hidden">
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
