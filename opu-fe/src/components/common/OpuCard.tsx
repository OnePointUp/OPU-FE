"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { CATEGORY_BADGE, type OpuCardModel } from "@/types/opu";

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
            className={`
            inline-flex items-center justify-center
            h-5 px-2 rounded-md
            text-[11px] font-medium leading-[16px]
          `}
            style={{
                backgroundColor: bg,
                color: color,
            }}
        >
            {label}
        </span>
    );
}

export default function OpuCard({
    item,
    onAddTodo,
    onMore,
}: {
    item: OpuCardModel;
    onAddTodo?: (id: number) => void;
    onMore?: (id: number) => void;
}) {
    const [liked, setLiked] = useState(item.liked);

    const categoryKey = item.categoryName ?? "기타";
    const { bg, text } = CATEGORY_BADGE[categoryKey] ?? CATEGORY_BADGE["기타"];

    return (
        <div
            className="w-full rounded-2xl bg-[var(--background)] border px-5 py-4"
            style={{ borderColor: "var(--color-super-light-gray)" }}
            role="group"
            aria-label={item.title}
        >
            {/* 상단: 타이틀/카테고리 + 액션 */}
            <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[var(--text-body)] font-[var(--weight-medium)]">
                            {item.title}
                        </h3>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <Badge label={categoryKey} bg={bg} color={text} />
                        <Badge
                            label={item.periodLabel}
                            bg="#E3E3E3"
                            color="#6F6F6F"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {item.locked && (
                        <Icon
                            icon="material-symbols:lock-sharp"
                            width={20}
                            height={20}
                            style={{ color: "rgba(0,0,0,0.6)" }}
                            aria-label="locked"
                        />
                    )}

                    <button
                        type="button"
                        onClick={() => setLiked((v) => !v)}
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
                                    : "var(--color-super-dark-gray)",
                            }}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => onMore?.(item.id)}
                        className="inline-flex"
                        title="더보기"
                    >
                        <Icon
                            icon="lucide:ellipsis"
                            width={17}
                            height={17}
                            style={{ color: "var(--color-super-dark-gray)" }}
                        />
                    </button>
                </div>
            </div>

            {/* 하단: 완료횟수 + 버튼 */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Icon
                        icon="lets-icons:check-fill"
                        width={18}
                        height={18}
                        style={{ color: "var(--color-dark-navy)" }}
                    />

                    <span
                        className="text-[var(--color-dark-navy)]"
                        style={{
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {item.completedCount ?? 0}회 완료
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onAddTodo?.(item.id)}
                    className="py-2 px-11 rounded-full"
                    style={{
                        background: "var(--background)",
                        color: "var(--color-opu-green)",
                        border: "1.5px solid var(--color-opu-green)",
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    투두리스트 추가
                </button>
            </div>
        </div>
    );
}
