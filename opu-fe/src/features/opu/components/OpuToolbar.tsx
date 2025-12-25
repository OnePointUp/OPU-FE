"use client";

import { Icon } from "@iconify/react";

type Props = {
    sortLabel?: string;
    categoryLabel?: string;
    timeLabel?: string;
    onClickSort?: () => void;
    onClickCategory?: () => void;
    onClickTime?: () => void;
};

export default function OpuToolbar({
    timeLabel = "시간",
    categoryLabel = "카테고리",
    sortLabel = "정렬",
    onClickSort,
    onClickCategory,
    onClickTime,
}: Props) {
    return (
        <div className="flex justify-end items-center px-1 py-1 gap-2.5">
            <button
                type="button"
                onClick={onClickTime}
                className="flex items-center justify-center gap-1 cursor-pointer"
                style={{ fontSize: "var(--text-caption)" }}
            >
                <span>{timeLabel}</span>
                <Icon
                    icon="ic:round-keyboard-arrow-down"
                    width={16}
                    height={16}
                    style={{ color: "var(--color-dark-gray)" }}
                />
            </button>

            <button
                type="button"
                onClick={onClickCategory}
                className="flex items-center justify-center gap-1 cursor-pointer"
                style={{ fontSize: "var(--text-caption)" }}
            >
                <span>{categoryLabel}</span>
                <Icon
                    icon="ic:round-keyboard-arrow-down"
                    width={16}
                    height={16}
                    style={{ color: "var(--color-super-dark-gray)" }}
                />
            </button>

            <button
                type="button"
                onClick={onClickSort}
                className="flex items-center justify-center gap-1 cursor-pointer"
                style={{ fontSize: "var(--text-caption)" }}
            >
                <span>{sortLabel}</span>
                <Icon
                    icon="ic:round-keyboard-arrow-down"
                    width={16}
                    height={16}
                    style={{ color: "var(--color-super-dark-gray)" }}
                />
            </button>
        </div>
    );
}
