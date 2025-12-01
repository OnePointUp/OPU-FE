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
};

export default function UserInfo({
    nickname,
    email,
    bio = "아직 자기소개가 없어요 😊",
    profileImageUrl,
    handleEdit,
    loading = false,
}: Props) {
    const initial =
        nickname && nickname.trim().length > 0 ? nickname.trim().charAt(0) : "";

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
            className="flex items-center mb-6 gap-4 justify-between cursor-pointer active:opacity-80 transition"
            onClick={handleEdit}
        >
            <div className="flex gap-5">
                <div className="relative size-16 overflow-hidden rounded-full border border-[var(--color-super-light-gray)] bg-[var(--background)]">
                    {profileImageUrl ? (
                        <Image
                            src={profileImageUrl}
                            alt={`${nickname} profileImage`}
                            fill
                            sizes="56px"
                            className="object-cover"
                            loading="eager"
                            priority
                        />
                    ) : (
                        <div className="grid h-full w-full place-items-center text-[var(--color-light-gray)] font-[var(--weight-semibold)]">
                            {initial}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <p
                        className="truncate text-[var(--color-dark-navy)]"
                        style={{
                            fontSize: "var(--text-h3)",
                            fontWeight: "var(--weight-bold)",
                        }}
                    >
                        {nickname}
                    </p>

                    <p
                        className="truncate text-[var(--color-light-gray)]"
                        style={{
                            fontSize: "var(--text-caption)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {email}
                    </p>
                    <p
                        className="truncate text-[var(--color-dark-navy)]"
                        style={{
                            fontSize: "var(--text-caption)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {bio}
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
