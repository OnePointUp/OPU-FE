"use client";

import Image from "next/image";
import { useRef } from "react";
import { Icon } from "@iconify/react";

type Props = {
    nickname: string;
    previewUrl?: string;
    onPick: (file: File) => void;
    className?: string;
};

export default function ProfileAvatarPicker({
    nickname,
    previewUrl,
    onPick,
    className = "",
}: Props) {
    const fileRef = useRef<HTMLInputElement>(null);

    const initial =
        nickname && nickname.trim().length > 0 ? nickname.trim().charAt(0) : "";

    return (
        <section
            className={`w-full flex justify-center pt-6 pb-2 ${className}`}
        >
            <div className="relative inline-block">
                <div className="size-24 overflow-hidden rounded-full border border-[var(--color-super-light-gray)] bg-[var(--background)] relative">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="profile"
                            fill
                            sizes="96px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="grid h-full w-full place-items-center select-none">
                            <span
                                style={{
                                    fontSize: "var(--text-h3)",
                                    fontWeight: "var(--weight-semibold)",
                                    color: "var(--color-light-gray)",
                                    lineHeight: 1,
                                }}
                                aria-hidden
                            >
                                {initial}
                            </span>
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

                <div
                    className="
                        absolute bottom-0 right-0 
                        grid place-items-center size-6 rounded-full
                        bg-white shadow-sm ring-1 ring-[var(--color-super-light-gray)]
                        pointer-events-none
                    "
                >
                    <Icon
                        icon="flowbite:pen-outline"
                        width="16"
                        height="16"
                        style={{ color: "var(--color-dark-gray)" }}
                    />
                </div>
            </div>

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
