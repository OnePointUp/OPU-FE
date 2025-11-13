"use client";

import Image from "next/image";

type Props = {
    nickname: string;
    email: string;
    bio?: string;
    profileImageUrl?: string;
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
            <section
                className="`w-full px-2 mt-4"
                style={{ width: "min(100%, var(--app-max))" }}
            >
                <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full skeleton" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-20 rounded skeleton" />
                        <div className="h-3 w-36 rounded skeleton" />
                        <div className="h-3 w-52 rounded skeleton" />
                    </div>
                </div>

                <button
                    disabled
                    className="mt-5 h-10 w-full rounded-xl border border-[var(--color-super-light-gray)] bg-[var(--background)] text-[var(--color-light-gray)]"
                    style={{ fontSize: "var(--text-sub)" }}
                >
                    프로필 편집
                </button>
                <div className="mt-5 h-2 bg-[#F3F5F8] -mx-8" />
            </section>
        );
    }

    return (
        <section
            className="w-full px-2 mt-4"
            style={{ width: "min(100%, var(--app-max))" }}
        >
            <div className="flex items-center gap-4">
                <div className="relative size-16 overflow-hidden rounded-full border border-[var(--color-super-light-gray)] bg-[var(--background)]">
                    {profileImageUrl ? (
                        <Image
                            src={profileImageUrl}
                            alt={`${nickname} profileImage`}
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="grid h-full w-full place-items-center text-[var(--color-light-gray)] font-[var(--weight-semibold)]">
                            {initial}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
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

            <button
                type="button"
                onClick={handleEdit}
                className="mt-5 h-10 w-full rounded-xl border bg-[var(--background)]"
                style={{
                    borderColor: "var(--color-super-light-gray)",
                    fontWeight: "var(--weight-semibold)",
                    fontSize: "var(--text-sub)",
                }}
            >
                프로필 편집
            </button>
            <div className="mt-5 h-2 bg-[#F3F5F8] -mx-7" />
        </section>
    );
}
