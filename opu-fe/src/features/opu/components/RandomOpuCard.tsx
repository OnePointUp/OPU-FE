"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { CATEGORY_BADGE, type OpuCardModel } from "@/features/opu/domain";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

type Props = {
    item: OpuCardModel;
    onAddTodo?: (id: number) => void;
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
            className="inline-flex items-center justify-center h-5 px-2 rounded-full font-medium leading-[16px]"
            style={{
                backgroundColor: bg,
                color,
                fontSize: 11,
            }}
        >
            {label}
        </span>
    );
}

export default function RandomOpuCard({
    item,
    onAddTodo,
    loading = false,
}: Props) {
    const [liked, setLiked] = useState(item.liked);

    const categoryKey = item.categoryName ?? "기타";
    const { bg, text } = CATEGORY_BADGE[categoryKey] ?? CATEGORY_BADGE["기타"];

    const isMine = item.creatorId === CURRENT_MEMBER_ID;
    const isPrivate = isMine && item.shareLabel === "비공유";

    const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setLiked((v) => !v);
    };

    const handleAddTodoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!onAddTodo) return;
        onAddTodo(item.id);
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
            className="w-full items-center justify-center rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--color-super-light-gray)" }}
            role="group"
            aria-label={item.title}
        >
            {/* 찜하기 */}
            <button
                type="button"
                onClick={handleLikeClick}
                aria-pressed={liked}
                className="w-full flex justify-end"
                title="찜하기"
            >
                <Icon
                    icon={liked ? "mdi:heart" : "mdi:heart-outline"}
                    width={25}
                    height={25}
                    style={{
                        color: liked
                            ? "var(--color-like-pink)"
                            : "var(--color-dark-gray)",
                    }}
                />
            </button>

            <div className="flex flex-col w-full items-center justify-center gap-2">
                {/* 이모지 */}
                <span style={{ fontSize: 35 }}>{item.emoji ?? "❓"}</span>

                {/* 제목 */}
                <span
                    className="w-full flex justify-center items-center text-center gap-1 px-5"
                    style={{
                        fontSize: "var(--text-h3)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    {item.title}
                    {isPrivate && (
                        <Icon
                            icon="material-symbols:lock-sharp"
                            width={15}
                            height={15}
                            style={{ color: "var(--color-dark-gray)" }}
                        />
                    )}
                </span>

                {/* 배지 */}
                <div className="flex items-center justify-center gap-1 flex-wrap">
                    <Badge label={categoryKey} bg={bg} color={text} />
                    <Badge
                        label={item.timeLabel}
                        bg="#E3E3E3"
                        color="#6F6F6F"
                    />
                </div>

                {/* 설명 */}
                {item.description && (
                    <p
                        className="line-clamp-2 mt-3"
                        style={{
                            color: "var(--color-light-gray)",
                            fontSize: 11,
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {item.description}
                    </p>
                )}
            </div>

            {/* 투두리스트 추가 버튼 */}
            {onAddTodo && (
                <div className="mt-5 w-full flex justify-center">
                    <button
                        type="button"
                        onClick={handleAddTodoClick}
                        className="w-full inline-flex items-center justify-center gap-1 py-2 rounded-full border"
                        style={{
                            borderColor: "var(--color-opu-pink)",
                            color: "var(--color-opu-pink)",
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-medium)",
                        }}
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            width={14}
                            height={14}
                            color="var(--color-opu-pink)"
                        />
                        <span>투두리스트에 추가</span>
                    </button>
                </div>
            )}

            {/* 하단 영역 */}
            {/* <div className="flex items-end justify-between mt-5">
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
            </div> */}
        </div>
    );
}
