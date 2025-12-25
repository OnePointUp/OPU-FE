"use client";

import { Icon } from "@iconify/react";

type MonthPickerProps = {
    year: number;
    month: number;
    onPrev: () => void;
    onNext: () => void;
};

export default function MonthPicker({
    year,
    month,
    onPrev,
    onNext,
}: MonthPickerProps) {
    return (
        <section className="flex items-center px-20">
            {/* 이전 달 */}
            <button
                type="button"
                className="p-2 shrink-0 cursor-pointer"
                aria-label="이전 달"
                onClick={onPrev}
            >
                <Icon
                    icon="mingcute:left-line"
                    width={18}
                    height={18}
                    color="var(--color-light-gray)"
                />
            </button>

            {/* 년/월 텍스트 */}
            <p
                className="flex-1 text-center"
                style={{
                    fontSize: "var(--text-h3)",
                    fontWeight: "var(--weight-semibold)",
                }}
            >
                {year}년 {month}월
            </p>

            {/* 다음 달 */}
            <button
                type="button"
                className="p-2 shrink-0 cursor-pointer"
                aria-label="다음 달"
                onClick={onNext}
            >
                <Icon
                    icon="mingcute:right-line"
                    width={18}
                    height={18}
                    color="var(--color-light-gray)"
                />
            </button>
        </section>
    );
}
