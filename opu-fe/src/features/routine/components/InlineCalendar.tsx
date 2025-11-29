"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

type InlineCalendarProps = {
    value: string | null;
    onSelect: (value: string) => void;
};

function toDateString(year: number, month: number, day: number) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function InlineCalendar({
    value,
    onSelect,
}: InlineCalendarProps) {
    const [year, setYear] = useState<number>(() => {
        const base = value ? new Date(value) : new Date();
        return base.getFullYear();
    });

    const [month, setMonth] = useState<number>(() => {
        const base = value ? new Date(value) : new Date();
        return base.getMonth(); // 0~11
    });

    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // 연도 섹션: 현재 연도 기준 -1, 현재, +1
    const yearOptions = useMemo(() => [year - 1, year, year + 1], [year]);

    const { cells, selectedDay, monthLabel } = useMemo(() => {
        const first = new Date(year, month, 1);
        const jsDay = first.getDay();
        const startOffset = (jsDay + 6) % 7;

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const tmp: (number | null)[] = [];
        for (let i = 0; i < startOffset; i++) tmp.push(null);
        for (let d = 1; d <= daysInMonth; d++) tmp.push(d);
        while (tmp.length % 7 !== 0) tmp.push(null);

        let selected: number | null = null;
        if (value) {
            const d = new Date(value);
            if (d.getFullYear() === year && d.getMonth() === month) {
                selected = d.getDate();
            }
        }

        return {
            cells: tmp,
            selectedDay: selected,
            monthLabel: `${year}년 ${month + 1}월`,
        };
    }, [year, month, value]);

    const moveMonth = (delta: number) => {
        setMonth((prev) => {
            const next = prev + delta;
            if (next < 0) {
                setYear((y) => y - 1);
                return 11;
            }
            if (next > 11) {
                setYear((y) => y + 1);
                return 0;
            }
            return next;
        });
    };

    const handleSelect = (day: number) => {
        const next = toDateString(year, month, day);
        onSelect(next);
    };

    const handleMonthLabelClick = () => {
        setShowMonthPicker((prev) => !prev);
    };

    const handleSelectMonth = (targetYear: number, targetMonth: number) => {
        setYear(targetYear);
        setMonth(targetMonth);
        setShowMonthPicker(false);
    };

    return (
        <div className="bg-white px-3 pt-3 pb-5">
            {/* 상단: 월 변경 + 월 선택 패널 */}
            <div className="flex items-center justify-between mb-3 ml-1.5 relative">
                <button
                    type="button"
                    onClick={handleMonthLabelClick}
                    className="text-left"
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    {monthLabel}
                </button>

                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveMonth(-1)}>
                        <Icon
                            icon="mdi:chevron-left"
                            width={20}
                            height={20}
                            className="text-[var(--color-dark-gray)]"
                        />
                    </button>
                    <button type="button" onClick={() => moveMonth(1)}>
                        <Icon
                            icon="mdi:chevron-right"
                            width={20}
                            height={20}
                            className="text-[var(--color-dark-gray)]"
                        />
                    </button>
                </div>

                {showMonthPicker && (
                    <div className="absolute left-0 top-6 z-10 rounded-xl border border-[var(--color-super-light-gray)] bg-white shadow-md py-2 max-h-72 overflow-y-auto min-w-[180px]">
                        {yearOptions.map((y) => (
                            <div
                                key={y}
                                className="px-4 py-2 border-b last:border-b-0 border-[var(--color-super-light-gray)]"
                            >
                                <div
                                    className="mb-2"
                                    style={{
                                        fontSize: "var(--text-caption)",
                                        color: "var(--color-dark-navy)",
                                        fontWeight: "var(--weight-semibold)",
                                    }}
                                >
                                    {y}년
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    {Array.from(
                                        { length: 12 },
                                        (_, i) => i
                                    ).map((m) => {
                                        const isCurrent =
                                            y === year && m === month;
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectMonth(y, m)
                                                }
                                                className="w-8 h-8 rounded-full"
                                                style={{
                                                    fontSize:
                                                        "var(--text-caption)",
                                                    color: isCurrent
                                                        ? "#ffffff"
                                                        : "var(--color-dark-navy)",
                                                    backgroundColor: isCurrent
                                                        ? "#000000"
                                                        : "var(--color-super-light-gray)",
                                                }}
                                            >
                                                {m + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 text-center mb-2 -mx-3">
                {WEEKDAYS.map((d) => (
                    <span
                        key={d}
                        style={{
                            color:
                                d === "토"
                                    ? "var(--color-saturday)"
                                    : d === "일"
                                    ? "var(--color-sunday)"
                                    : "var(--color-dark-gray)",
                            fontSize: "var(--text-caption)",
                        }}
                    >
                        {d}
                    </span>
                ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 text-center gap-y-1.5 mt-1 -mx-3">
                {cells.map((day, idx) => {
                    if (!day) return <span key={idx} className="h-8" />;

                    const isSelected = selectedDay === day;

                    const cellDate = new Date(year, month, day);
                    cellDate.setHours(0, 0, 0, 0);
                    const isToday = cellDate.getTime() === today.getTime();

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(day)}
                            className="mx-auto flex items-center justify-center w-7 h-7 rounded-full"
                            style={{
                                backgroundColor: isSelected
                                    ? "#000000"
                                    : isToday
                                    ? "var(--color-super-light-gray)"
                                    : "transparent",
                                color: isSelected
                                    ? "#ffffff"
                                    : "var(--color-dark-navy)",
                                fontSize: "var(--text-sub)",
                            }}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
