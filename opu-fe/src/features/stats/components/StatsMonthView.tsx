"use client";

import { CALENDAR_COLORS } from "../types";

type CalendarCellLike = {
    date: string;
    intensity: number;
};

export default function StatsMonthView({
    calendarMatrix,
    onSelectDay,
    loading = false,
}: {
    calendarMatrix: (CalendarCellLike | null)[][];
    selectedDay: CalendarCellLike | null;
    onSelectDay: (d: CalendarCellLike) => void;
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
                            onClick={() => onSelectDay(day)}
                            className={`
                              rounded-xl flex items-center justify-center
                              aspect-square
                              text-agreement-optional text-[var(--color-dark-gray)]
                            `}
                            style={{
                                backgroundColor:
                                    CALENDAR_COLORS[day.intensity] ??
                                    CALENDAR_COLORS[0],
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
