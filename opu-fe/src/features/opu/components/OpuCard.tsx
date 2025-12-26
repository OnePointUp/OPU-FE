"use client";

import { Icon } from "@iconify/react";
import { useState, type MouseEvent } from "react";
import { getCategoryBadge, type OpuCardModel } from "@/features/opu/domain";
import Badge from "@/components/common/Badge";
import OpuCardSkekleton from "./OpuCardSkeleton";

type Props = {
    item: OpuCardModel;
    onAddTodo?: (id: number) => void;
    onMore?: (id: number) => void;
    onToggleFavorite?: (id: number) => Promise<void> | void;
    loading?: boolean;
};

export default function OpuCard({
    item,
    onMore,
    onToggleFavorite,
    loading = false,
}: Props) {
    const liked = item.isLiked === true;
    const likeCount = item.likeCount ?? 0;
    const [likeLoading, setLikeLoading] = useState(false);

    const { bg, text } = getCategoryBadge(item.categoryId, item.categoryName);
    const categoryLabel = item.categoryName ?? "기타";

    const isMine = item.isMine === true;
    const isPrivate = isMine && item.isShared === false;

    const handleCardClick = () => {
        onMore?.(item.id);
    };

    const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (likeLoading) return;
        setLikeLoading(true);

        try {
            await onToggleFavorite?.(item.id);
        } finally {
            setLikeLoading(false);
        }
    };

    if (loading) {
        return <OpuCardSkekleton />;
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
                        className="break-words whitespace-pre-line flex items-center gap-0.5 w-full mb-1"
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
                        <Badge label={categoryLabel} bg={bg} color={text} />
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
                    className="inline-flex disabled:opacity-50 cursor-pointer"
                    title="찜하기"
                    disabled={likeLoading}
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
                    className="break-words whitespace-pre-line mt-0.5 mb-2"
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
                            {likeCount.toLocaleString()}
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
