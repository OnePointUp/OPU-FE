"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { CATEGORY_BADGE, type OpuCardModel } from "@/features/opu/domain";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

type Props = {
    item: OpuCardModel;
    onAddTodo?: (id: number) => void;
    onMore?: (id: number) => void;
    loading?: boolean;
};

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
            className="inline-flex items-center justify-center h-4 px-1 rounded-sm font-medium leading-[16px]"
            style={{
                backgroundColor: bg,
                color,
                fontSize: "var(--text-mini)",
            }}
        >
            {label}
        </span>
    );
}

export default function OpuCard({ item, onMore, loading = false }: Props) {
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

    // 스켈레톤
    if (loading) {
        return (
            <div
                className="w-full rounded-xl bg-[var(--background)] border px-3 pt-3 pb-2"
                style={{ borderColor: "var(--color-super-light-gray)" }}
            >
                <div className="flex justify-between mb-1">
                    {/* <div
                            className="rounded-xl skeleton"
                            style={{ width: 35, height: 35 }}
                        /> */}
                    <div className="flex flex-col gap-1 mb-1">
                        <div className="h-4 w-24 rounded-md skeleton" />
                        <div className="h-4 w-20 rounded-md skeleton" />
                    </div>
                    <div className="h-5 w-5 rounded-full skeleton" />
                </div>

                <div className="h-3 w-36 rounded-md skeleton mt-1" />
                <div className="h-3 w-24 rounded-md skeleton mt-1" />

                <div className="flex items-end justify-between mt-2">
                    <div className="h-3 w-18 rounded-md skeleton" />
                    <div className="h-3 w-12 rounded-md skeleton" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full rounded-xl bg-[var(--background)] border px-3 pt-3 pb-2"
            style={{ borderColor: "var(--color-super-light-gray)" }}
            role="group"
            aria-label={item.title}
            onClick={handleCardClick}
        >
            <div className="flex items-start justify-between mb-2.5">
                <div className="flex flex-col items-start min-w-0 w-full">
                    {/* 이모지 */}
                    <div className="p-1 bg-[var(--color-opu-yellow)] rounded-2xl mb-1">
                        <span
                            className="flex items-center justify-center"
                            style={{
                                fontSize: "var(--text-h2)",
                                width: 30,
                                height: 30,
                            }}
                        >
                            {item.emoji ?? "❓"}
                        </span>
                    </div>

                    {/* 제목 */}
                    <span
                        className="flex items-center gap-0.5 line-clamp-2 mb-1 w-full"
                        style={{
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-semibold)",
                        }}
                    >
                        {item.title}
                        {isPrivate && (
                            <Icon
                                className="mb-0.5"
                                icon="material-symbols:lock-sharp"
                                width={11}
                                height={11}
                                style={{ color: "var(--color-dark-gray)" }}
                            />
                        )}
                    </span>

                    {/* 배지 */}
                    <div className="flex items-center gap-1 flex-wrap">
                        <Badge label={categoryKey} bg={bg} color={text} />
                        <Badge
                            label={item.timeLabel}
                            bg="#E3E3E3"
                            color="#6F6F6F"
                        />
                    </div>
                </div>

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

            {/* 설명 */}
            {item.description && (
                <p
                    className="line-clamp-2 mt-0.5 mb-2"
                    style={{
                        color: "var(--color-light-gray)",
                        fontSize: "var(--text-mini)",
                        fontWeight: "var(--weight-regular)",
                    }}
                >
                    {item.description}
                </p>
            )}

            {/* 하단 영역 */}
            <div className="flex items-end justify-between">
                <div className="flex items-center gap-1.5">
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
