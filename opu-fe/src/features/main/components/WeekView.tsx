"use client";

import { CALENDAR_COLORS, DailyTodoStats } from "@/mocks/api/db/calendar.db";

export default function WeekView({
    week,
    selectedDay,
    onSelectDay,
    todayStr,
}: {
    week: (DailyTodoStats | null)[];
    selectedDay: DailyTodoStats | null;
    onSelectDay: (d: DailyTodoStats) => void;
    todayStr: string;
}) {
    return (
        <div className="grid grid-cols-7 w-full gap-1.5 sm:gap-2.5 md:gap-3.5">
            {week.map((day, idx) =>
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
                                    ? "2px solid var(--color-opu-dark-green)"
                                    : "none",
                        }}
                    >
                        {new Date(day.date).getDate()}
                    </button>
                ) : (
                    <div key={`empty-${idx}`} />
                )
            )}
        </div>
    );
}
