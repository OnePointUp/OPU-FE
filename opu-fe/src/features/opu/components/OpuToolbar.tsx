"use client";

import { Icon } from "@iconify/react";

type Props = {
    sortLabel?: string;
    categoryLabel?: string;
    periodLabel?: string;
    onClickSort?: () => void;
    onClickCategory?: () => void;
    onClickPeriod?: () => void;
};

export default function OpuToolbar({
    periodLabel = "시간",
    categoryLabel = "카테고리",
    sortLabel = "정렬",
    onClickSort,
    onClickCategory,
    onClickPeriod,
}: Props) {
    return (
        <div className="mt-3">
            <div className="mx-auto flex items-center justify-end px-2 py-1 gap-3">
                <button
                    type="button"
                    onClick={onClickPeriod}
                    className="flex items-center justify-center gap-1 text-[13px]"
                >
                    <span>{periodLabel}</span>
                    <Icon
                        icon="ic:round-keyboard-arrow-down"
                        width={16}
                        height={16}
                        style={{ color: "var(--color-super-dark-gray)" }}
                    />
                </button>

                <button
                    type="button"
                    onClick={onClickCategory}
                    className="flex items-center justify-center gap-1 text-[13px]"
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
                    className="flex items-center justify-center gap-1 text-[13px]"
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
        </div>
    );
}
