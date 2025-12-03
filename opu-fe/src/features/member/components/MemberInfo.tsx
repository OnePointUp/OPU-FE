"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

type Props = {
    nickname: string;
    email: string;
    bio?: string;
    profileImageUrl?: string | null;
    handleEdit?: () => void;
    loading?: boolean;
    authProvider?: string | null;
};

export default function MemberInfo({
    nickname,
    email,
    bio = "아직 자기소개가 없어요 😊",
    profileImageUrl,
    handleEdit,
    loading = false,
    authProvider,
}: Props) {
    console.log("authProvider: ", authProvider);
    const displayBio =
        bio && bio.trim().length > 0 ? bio : "아직 자기소개가 없어요 😊";

    if (loading) {
        return (
            <div className="flex items-center mb-6 gap-4 justify-between cursor-default">
                <div className="flex gap-5 flex-1">
                    <div className="size-16 rounded-full skeleton" />
                    <div className="flex flex-col flex-1 justify-center space-y-2">
                        <div className="h-4 w-20 rounded skeleton" />
                        <div className="h-3 w-36 rounded skeleton" />
                        <div className="h-3 w-52 rounded skeleton" />
                    </div>
                </div>
                <div className="w-6 h-6 skeleton rounded" />
            </div>
        );
    }

    return (
        <div
            className="flex items-center mb-6 justify-between cursor-pointer active:opacity-80 transition"
            onClick={handleEdit}
        >
            <div className="flex gap-5 mr-4">
                <div className="relative w-16 h-16 overflow-hidden rounded-full border border-[var(--color-super-light-gray)] bg-[var(--background)]">
                    {profileImageUrl ? (
                        <Image
                            src={profileImageUrl}
                            alt={`${nickname} profileImage`}
                            fill
                            sizes="56px"
                            className="w-full h-full object-cover"
                            loading="eager"
                            priority
                        />
                    ) : (
                        <div className="relative h-full w-full overflow-hidden rounded-full select-none">
                            <Image
                                src="/images/profile-image.png"
                                alt="profile-default"
                                fill
                                sizes="96px"
                                className="object-cover scale-130"
                            />
                            <span className="sr-only">{nickname}의 프로필</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                        <p
                            className="truncate text-[var(--color-dark-navy)]"
                            style={{
                                fontSize: "var(--text-h3)",
                                fontWeight: "var(--weight-bold)",
                            }}
                        >
                            {nickname}
                        </p>

                        {authProvider === "kakao" && (
                            <Image
                                src="/images/kakao-simple-logo.png"
                                width={18}
                                height={18}
                                alt="카카오 로그인"
                            />
                        )}
                    </div>

                    <p
                        className="text-[var(--color-light-gray)]"
                        style={{
                            fontSize: "var(--text-caption)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {email}
                    </p>
                    <p
                        className="flex-1 mt-1 text-[var(--color-dark-navy)] break-words whitespace-pre-line"
                        style={{
                            fontSize: "var(--text-caption)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {displayBio}
                    </p>
                </div>
            </div>
            <button type="button" onClick={handleEdit}>
                <Icon
                    icon="mdi:chevron-right"
                    width={25}
                    height={25}
                    className="text-[var(--color-dark-navy)]"
                />
            </button>
        </div>
    );
}
