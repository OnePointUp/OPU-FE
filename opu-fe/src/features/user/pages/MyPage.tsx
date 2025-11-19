"use client";

import { useRouter } from "next/navigation";
import UserInfo from "@/features/user/components/UserInfo";
import SettingsList from "@/features/user/components/SettingsList";
import Menu from "@/components/layout/Menu";
import { useMyProfile } from "../hooks/useMyProfile";
import { myPageMenuItems } from "../constants/myPageMenu";
import OpuManagement from "../components/OpuManagement";
import { useEffect, useState } from "react";
import { fetchMyOpuCards, fetchOpuCardsByMember } from "@/features/opu/service";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default function MyPageScreen() {
    const router = useRouter();
    const { profile, loading } = useMyProfile();
    const [likedCount, setLikedCount] = useState(0);
    const [myCount, setMyCount] = useState(0);
    const [opuLoading, setOpuLoading] = useState(true);

    const items = myPageMenuItems;

    function handleEdit() {
        router.push("/me/profile");
    }

    useEffect(() => {
        const load = async () => {
            setOpuLoading(true);

            const [all, mine] = await Promise.all([
                fetchOpuCardsByMember(CURRENT_MEMBER_ID),
                fetchMyOpuCards(CURRENT_MEMBER_ID),
            ]);

            setLikedCount(all.filter((opu) => opu.liked).length);
            setMyCount(mine.length);
            setOpuLoading(false);
        };

        load();
    }, []);

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

                <OpuManagement
                    likedCount={likedCount}
                    myCount={myCount}
                    loading={opuLoading}
                />

                <div className="mt-5 border-t border-[#F3F5F8]" />

                <div className="w-full mt-1.5">
                    <SettingsList items={items} />
                </div>
            </main>

            <Menu />
        </div>
    );
}
