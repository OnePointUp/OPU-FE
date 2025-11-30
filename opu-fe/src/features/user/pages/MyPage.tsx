"use client";

import { useRouter } from "next/navigation";
import UserInfo from "@/features/user/components/UserInfo";
import SettingsList from "@/features/user/components/SettingsList";
import { useMyPageMenuData } from "../constants/myPageMenu";
import OpuManagement from "../components/OpuManagement";
import { useMyProfile } from "../hooks/useMyProfile";

export default function MyPageScreen() {
    const router = useRouter();

    const { profile, loading } = useMyProfile();

    const { myPageMenuItems: items } = useMyPageMenuData();

    function handleEdit() {
        router.push("/me/profile");
    }

    return (
        <section>
            <UserInfo
                nickname={profile?.nickname ?? ""}
                email={profile?.email ?? ""}
                bio={profile?.bio}
                profileImageUrl={profile?.profileImageUrl}
                handleEdit={handleEdit}
                loading={loading}
            />

            <OpuManagement
                likedCount={profile?.favoriteOpuCount ?? 0}
                myCount={profile?.myOpuCount ?? 0}
                loading={loading}
            />

            <div className="mt-5 border-t border-[#F3F5F8]" />

            <div className="w-full mt-1.5">
                <SettingsList items={items} />
            </div>
        </section>
    );
}
