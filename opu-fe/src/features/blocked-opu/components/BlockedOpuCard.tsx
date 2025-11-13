"use client";

import { Icon } from "@iconify/react";
import { CATEGORY_BADGE } from "@/features/opu/domain";
import { type OpuCardModel } from "@/features/opu/domain";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";

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
            className="inline-flex items-center justify-center h-5 px-1 rounded-md font-medium leading-[16px]"
            style={{
                fontSize: "var(--text-mini)",
                backgroundColor: bg,
                color: color,
            }}
        >
            {label}
        </span>
    );
}

export default function BlockedOpuCard({
    item,
    onMore,
    selectable = false,
    checked = false,
    onCheckedChange,
}: {
    item: OpuCardModel;
    onMore?: (id: number) => void;
    onUnblock?: (id: number) => void;
    onAddToTodo?: (id: number) => void;
    selectable?: boolean;
    checked?: boolean;
    onCheckedChange?: (id: number, next: boolean) => void;
}) {
    const categoryKey = item.categoryName ?? "기타";
    const { bg, text } = CATEGORY_BADGE[categoryKey] ?? CATEGORY_BADGE["기타"];
    const dateLabel = item.createdAt ? formatDate(item.createdAt) : null;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex items-start gap-2">
            {selectable && (
                <input
                    type="checkbox"
                    className="custom-checkbox shrink-0 ml-2"
                    checked={checked}
                    onChange={(e) =>
                        onCheckedChange?.(item.id, e.target.checked)
                    }
                    aria-label={`${item.title} 선택`}
                />
            )}

            <div className="w-full bg-[var(--background)]">
                <div className="ml-2">
                    <div className="grid grid-cols-[50px_1fr_auto] items-start gap-4">
                        {/* 이모지 */}
                        <div
                            className="flex items-center justify-center rounded-md"
                            style={{
                                width: 50,
                                height: 50,
                                backgroundColor: "#F1F1F1",
                            }}
                        >
                            {item.emoji ?? "❓"}
                        </div>

                        {/* 타이틀 + 더보기 */}
                        <div className="min-w-0">
                            <div className="flex justify-between">
                                <p className="text-[var(--text-body)] font-[var(--weight-medium)]">
                                    {item.title}
                                </p>

                                <div className="relative">
                                    <button
                                        type="button"
                                        aria-haspopup="menu"
                                        aria-expanded={menuOpen}
                                        onClick={() => {
                                            onMore?.(item.id);
                                            setMenuOpen((v) => !v);
                                        }}
                                        className="inline-flex shrink-0 -mx-2"
                                        title="더보기"
                                    >
                                        <Icon
                                            icon="lucide:ellipsis"
                                            width={17}
                                            height={17}
                                            style={{
                                                color: "var(--color-super-dark-gray)",
                                            }}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* 뱃지 + 차단일 */}
                            <div className="mt-1 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 min-w-0">
                                    <Badge
                                        label={categoryKey}
                                        bg={bg}
                                        color={text}
                                    />
                                    <Badge
                                        label={item.periodLabel}
                                        bg="#F3F3F3"
                                        color="#959595"
                                    />
                                </div>

                                {dateLabel && (
                                    <span
                                        className="shrink-0 text-[var(--color-light-gray)] text-right -mx-2"
                                        style={{
                                            fontSize: "var(--text-mini)",
                                        }}
                                    >
                                        차단일 {dateLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 구분선 */}
                    <div className="h-[1px] bg-[var(--color-super-light-gray)] mt-4" />
                </div>
            </div>
        </div>
    );
}
