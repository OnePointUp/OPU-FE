"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { CATEGORY_BADGE, type OpuCardModel } from "@/features/opu/domain";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

function Badge({
    label,
    bg,
    color,
}: {
    label: string;
    bg: string;
    color: string;
}) {
    return (
        <span
            className="inline-flex items-center justify-center h-5 px-1.5 rounded-md font-medium leading-[16px]"
            style={{
                backgroundColor: bg,
                color: color,
                fontSize: "var(--text-mini)",
            }}
        >
            {label}
        </span>
    );
}

export default function OpuCard({
    item,
    onMore,
}: {
    item: OpuCardModel;
    onAddTodo?: (id: number) => void;
    onMore?: (id: number) => void;
}) {
    const [liked, setLiked] = useState(item.liked);

    const categoryKey = item.categoryName ?? "기타";
    const { bg, text } = CATEGORY_BADGE[categoryKey] ?? CATEGORY_BADGE["기타"];

    const isMine = item.creatorId === CURRENT_MEMBER_ID;
    const isPrivate = isMine && item.shareLabel === "비공유";

    const handleCardClick = () => {
        onMore?.(item.id);
    };

    const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setLiked((v) => !v);
    };

    return (
        <div
            className="w-full rounded-2xl bg-[var(--background)] border px-3 pt-3 pb-2"
            style={{ borderColor: "var(--color-super-light-gray)" }}
            role="group"
            aria-label={item.title}
            onClick={handleCardClick}
        >
            <div className="flex justify-between mb-2.5">
                <div className="flex gap-4 items-start">
                    <div
                        className="flex items-center justify-center rounded-xl"
                        style={{
                            width: 48,
                            height: 48,
                            backgroundColor: "var(--color-opu-yellow)",
                        }}
                    >
                        <span style={{ fontSize: "var(--text-h1)" }}>
                            {item.emoji ?? "❓"}
                        </span>
                    </div>

                    <div className="flex flex-col justify-between">
                        <span
                            style={{
                                fontSize: "var(--text-sub)",
                                fontWeight: "var(--weight-semibold)",
                            }}
                        >
                            {item.title}
                        </span>
                        <div className="mt-1 flex items-center gap-1">
                            <Badge label={categoryKey} bg={bg} color={text} />
                            <Badge
                                label={item.periodLabel}
                                bg="#E3E3E3"
                                color="#6F6F6F"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    {isPrivate && (
                        <Icon
                            icon="material-symbols:lock-sharp"
                            width={18}
                            height={18}
                            style={{ color: "var(--color-dark-gray)" }}
                        />
                    )}

                    <button
                        type="button"
                        onClick={handleLikeClick}
                        aria-pressed={liked}
                        className="inline-flex"
                        title="찜하기"
                    >
                        <Icon
                            icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                            width={20}
                            height={20}
                            style={{
                                color: liked
                                    ? "var(--color-like-pink)"
                                    : "var(--color-dark-gray)",
                            }}
                        />
                    </button>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                        <Icon
                            icon="lets-icons:check-fill"
                            width={15}
                            height={15}
                            style={{ color: "var(--color-opu-green)" }}
                        />

                        <span
                            style={{
                                fontSize: "var(--text-mini)",
                                fontWeight: "var(--weight-regular)",
                                color: "var(--color-dark-gray)",
                            }}
                        >
                            {item.completedCount ?? 0}
                        </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <Icon
                            icon="mdi:heart"
                            width={15}
                            height={15}
                            style={{ color: "var(--color-like-pink)" }}
                        />
                        <span
                            style={{
                                fontSize: "var(--text-mini)",
                                fontWeight: "var(--weight-regular)",
                                color: "var(--color-dark-gray)",
                            }}
                        >
                            {(item.likedCount ?? 0).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    <Icon
                        icon="material-symbols:person-rounded"
                        width={15}
                        height={15}
                        style={{ color: "var(--color-dark-gray)" }}
                    />
                    <span
                        style={{
                            fontSize: "var(--text-mini)",
                            fontWeight: "var(--weight-regular)",
                            color: "var(--color-dark-gray)",
                        }}
                    >
                        {item.creatorNickname ?? "시스템 등록"}
                    </span>
                </div>
            </div>
        </div>
    );
}
