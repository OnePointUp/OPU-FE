"use client";

import { CALENDAR_COLORS, DailyTodoStats } from "@/mocks/api/db/calendar.db";

export default function MonthView({
    calendarMatrix,
    selectedDay,
    onSelectDay,
    todayStr,
    loading = false,
}: {
    calendarMatrix: (DailyTodoStats | null)[][];
    selectedDay: DailyTodoStats | null;
    onSelectDay: (d: DailyTodoStats) => void;
    todayStr: string | null;
    loading?: boolean;
}) {
    /* ---------------------------------------------------------
     ⭐ 1) 로딩 시 Skeleton 캘린더 표시
     --------------------------------------------------------- */
    if (loading || calendarMatrix.length === 0) {
        // 기본적으로 6주(6 rows) 렌더링하는 skeleton
        const weeks = Array.from({ length: 6 });
        const days = Array.from({ length: 7 });

        return (
            <div className="grid grid-cols-7 gap-2 inline-grid mx-auto">
                {weeks.map((_, i) =>
                    days.map((_, j) => (
                        <div
                            key={`skeleton-${i}-${j}`}
                            className="skeleton rounded-xl w-10 h-10"
                        />
                    ))
                )}
            </div>
        );
    }

    /* ---------------------------------------------------------
     ⭐ 2) 실제 캘린더 UI 렌더링
     --------------------------------------------------------- */
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
                                backgroundColor: CALENDAR_COLORS[day.intensity],
                                border:
                                    selectedDay?.date === day.date
                                        ? "1px solid var(--color-dark-gray)"
                                        : "none",
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
