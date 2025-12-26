"use client";

import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

export default function MonthView({
    calendarMatrix,
    selectedDay,
    onSelectDay,
    onChangeMonth,
    todayStr,
    loading = false,
}: {
    calendarMatrix: (CalendarDay | null)[][];
    selectedDay: CalendarDay | null;
    onSelectDay: (d: CalendarDay) => void;
    onChangeMonth: (y: number, m: number) => void;
    todayStr: string | null;
    loading?: boolean;
}) {
    if (loading || calendarMatrix.length === 0) {
        const weeks = Array.from({ length: 5 });
        const days = Array.from({ length: 7 });

        return (
            <div className="grid grid-cols-7 w-full gap-1.5 sm:gap-2.5 md:gap-3.5">
                {weeks.map((_, i) =>
                    days.map((_, j) => (
                        <div
                            key={`skeleton-${i}-${j}`}
                            className="skeleton rounded-xl aspect-square"
                        />
                    ))
                )}
            </div>
        );
    }

    const visibleMatrix = calendarMatrix.filter((week) =>
        week.some((cell) => cell !== null)
    );

    return (
        <div className="grid grid-cols-7 w-full gap-1.5 sm:gap-2.5 md:gap-3.5">
            {visibleMatrix.map((week, i) =>
                week.map((day, j) =>
                    day ? (
                        <button
                            key={day.date}
                            onClick={() => {
                                if (day.isPreview) {
                                    const d = new Date(day.date);
                                    onChangeMonth(d.getFullYear(), d.getMonth() + 1); // ★ 달 이동
                                }
                                onSelectDay(day);
                            }}
                            className={`
                                rounded-xl flex items-center justify-center cursor-pointer
                                aspect-square
                                text-agreement-optional
                                ${
                                    day.isPreview
                                        ? "text-[var(--color-light-gray)]"
                                        : "text-[var(--color-dark-gray)]"
                                }
                            `}
                            style={{
                                backgroundColor: day.isPreview
                                    ? "transparent"
                                    : day.color ?? "transparent",
                                border:
                                    selectedDay?.date === day.date
                                        ? "2px solid var(--color-opu-dark-green)"
                                        : "none",
                                opacity: day.isPreview ? 0.5 : 1,
                            }}
                        >
                            {new Date(day.date).getDate()}
                        </button>
                    ) : (
                        <div key={`empty-${i}-${j}`} />
                    )
                )
            )}
        </div>
    );
}
