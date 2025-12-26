"use client";

import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

export default function WeekView({
    week,
    selectedDay,
    onSelectDay,
    onChangeMonth,
    todayStr,
}: {
    week: (CalendarDay | null)[];
    selectedDay: CalendarDay | null;
    onChangeMonth: (y: number, m: number) => void;
    onSelectDay: (d: CalendarDay) => void;
    todayStr: string;
}) {
    return (
        <div className="grid grid-cols-7 w-full gap-1.5 sm:gap-2.5 md:gap-3.5">
            {week.map((day, idx) =>
                day ? (
                    <button
                        key={day.date}
                        onClick={() => {
                            if (day.isPreview) {
                                const d = new Date(day.date);
                                onChangeMonth(d.getFullYear(), d.getMonth() + 1);
                            }
                            onSelectDay(day);
                        }}
                        className={`
                            rounded-xl flex items-center justify-center cursor-pointer
                            aspect-square text-agreement-optional
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
                    <div key={`empty-${idx}`} />
                )
            )}
        </div>
    );
}
