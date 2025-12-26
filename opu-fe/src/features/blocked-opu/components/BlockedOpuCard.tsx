"use client";

import { Icon } from "@iconify/react";
import { CATEGORY_BADGE } from "@/features/opu/domain";
import { type OpuCardModel } from "@/features/opu/domain";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";
import Badge from "@/components/common/Badge";

export default function BlockedOpuCard({
    item,
    onMore,
    selectable = false,
    checked = false,
    onCheckedChange,
}: {
    item: OpuCardModel;
    onMore?: (id: number) => void;
    selectable?: boolean;
    checked?: boolean;
    onCheckedChange?: (id: number, next: boolean) => void;
}) {
    const categoryKey = item.categoryName ?? "기타";
    const { bg, text } = CATEGORY_BADGE[categoryKey] ?? CATEGORY_BADGE["기타"];
    const dateLabel = item.blockedAt ? formatDate(item.blockedAt) : null;
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleChecked = () => {
        if (!selectable) return;
        onCheckedChange?.(item.id, !checked);
    };

    return (
        <div
            className="flex items-start gap-1 cursor-pointer"
            onClick={toggleChecked}
        >
            {selectable && (
                <input
                    type="checkbox"
                    className="custom-checkbox shrink-0 ml-1"
                    checked={checked}
                    onChange={(e) =>
                        onCheckedChange?.(item.id, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()} // 카드 클릭 방지
                    aria-label={`${item.title} 선택`}
                />
            )}

            <div className="w-full bg-[var(--background)]">
                <div className="ml-1">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center p-1 bg-[var(--color-opu-yellow)] rounded-2xl mt-0.5">
                            <span
                                className="flex items-center justify-center shrink-0"
                                style={{
                                    fontSize: "var(--text-h2)",
                                    width: 35,
                                    height: 35,
                                }}
                            >
                                {item.emoji ?? "❓"}
                            </span>
                        </div>

                        <div className="w-full flex flex-col">
                            <div className="flex items-start justify-between">
                                <p
                                    style={{
                                        fontSize: "var(--text-sub)",
                                        fontWeight: "var(--weight-semibold)",
                                    }}
                                >
                                    {item.title}
                                </p>
                                <button
                                    type="button"
                                    className="cursor-pointer"
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMore?.(item.id);
                                        setMenuOpen((v) => !v);
                                    }}
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

                            <div className="mt-1 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 min-w-0">
                                    <Badge
                                        label={categoryKey}
                                        bg={bg}
                                        color={text}
                                    />
                                    <Badge
                                        label={item.timeLabel}
                                        bg="#F3F3F3"
                                        color="#959595"
                                    />
                                </div>

                                {dateLabel && (
                                    <span
                                        className="shrink-0 text-[var(--color-light-gray)] text-right"
                                        style={{ fontSize: "var(--text-mini)" }}
                                    >
                                        차단일 {dateLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-[1px] bg-[var(--color-super-light-gray)] mt-3" />
                </div>
            </div>
        </div>
    );
}
