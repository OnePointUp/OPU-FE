"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "@iconify/react";

type Props = {
    nickname: string;
    previewUrl?: string | null;
    onPick: (file: File) => void;
    canDelete?: boolean;
    onClickDelete?: () => void;
    className?: string;
};

export default function ProfileAvatarPicker({
    nickname,
    previewUrl,
    onPick,
    canDelete = false,
    onClickDelete,
    className = "",
}: Props) {
    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <section
            className={`w-full flex flex-col items-center justify-center mb-6 ${className}`}
        >
            <div className="relative inline-block">
                <div className="size-22 overflow-hidden rounded-full border border-[var(--color-super-light-gray)] bg-[var(--background)] relative">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="profile"
                            fill
                            sizes="96px"
                            className="object-cover"
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

                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute inset-0 cursor-pointer"
                        aria-label="프로필 이미지 변경"
                    />
                </div>

                <div className="absolute bottom-0 right-0 grid place-items-center size-6 rounded-full bg-white shadow-sm ring-1 ring-[var(--color-super-light-gray)] pointer-events-none">
                    <Icon
                        icon="flowbite:pen-outline"
                        width="16"
                        height="16"
                        style={{ color: "var(--color-dark-gray)" }}
                    />
                </div>
            </div>

            {canDelete && onClickDelete && (
                <button
                    type="button"
                    className="mt-2 underline text-[var(--color-light-gray)] underline-offset-2 hover:underline"
                    style={{ fontSize: "var(--text-mini)" }}
                    onClick={onClickDelete}
                >
                    프로필 사진 삭제
                </button>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPick(f);
                }}
            />
        </section>
    );
}
