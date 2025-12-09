"use client";

import { useState } from "react";

import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

import DaySelector from "./DaySelector";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import { WEEKDAYS } from "@/features/stats/types";

type Props = {
    year: number;
    month: number;

    calendarMatrix: (CalendarDay | null)[][];
    selectedDay: CalendarDay | null;

    onSelectDay: (day: CalendarDay) => void;
    onChangeMonth: (y: number, m: number) => void;
};

export default function Calendar({
    year,
    month,
    calendarMatrix,
    selectedDay,
    onSelectDay,
    onChangeMonth,
}: Props) {
    const today = new Date();

    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [viewMode, setViewMode] = useState<"month" | "week">("month");

    // 기존 구조 유지: 선택한 날짜가 속한 주를 찾는 함수
    const getWeekOf = (dateStr: string | undefined): (CalendarDay | null)[] => {
        if (!dateStr) return calendarMatrix[0] ?? [];
        for (const week of calendarMatrix) {
            if (week.some((d) => d?.date === dateStr)) return week;
        }
        return calendarMatrix[0] ?? [];
    };

    return (
        <div className="space-y-2 mb-4">
            {/* 날짜 선택 헤더 */}
            <DaySelector
                year={year}
                month={month}
                day={
                    selectedDay
                        ? new Date(selectedDay.date).getDate()
                        : today.getDate()
                }
                onSelect={(y, m, d) => {
                    onChangeMonth(y, m);

                    const targetDate = `${y}-${String(m).padStart(
                        2,
                        "0"
                    )}-${String(d).padStart(2, "0")}`;

                    const flat = calendarMatrix.flat().filter(Boolean) as CalendarDay[];
                    const found = flat.find((c) => c.date === targetDate);
                    if (found) onSelectDay(found);
                }}
                onToggleView={() =>
                    setViewMode(viewMode === "month" ? "week" : "month")
                }
                viewMode={viewMode}
            />

            {/* StatsCalendar 스타일로 감싸는 캘린더 카드 */}
            <section className="mt-1 rounded-xl border border-[var(--color-super-light-gray)] bg-white px-4 py-3 flex justify-center">
                <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px]">
                    {/* 요일 */}
                    <div className="mb-2 grid grid-cols-7 w-full gap-1 sm:gap-2 md:gap-3">
                        {WEEKDAYS.map((day) => (
                            <div
                                key={day}
                                className={`flex items-center justify-center text-center aspect-square
                                ${
                                    day === "일"
                                        ? "text-[var(--color-sunday)]"
                                        : day === "토"
                                        ? "text-[var(--color-saturday)]"
                                        : "text-[var(--color-dark-gray)]"
                                }
                            `}
                                style={{ fontSize: "var(--text-caption)" }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 월 / 주 뷰 */}
                    <div
                        className={`w-full overflow-hidden relative transition-all duration-300 ease-in-out ${
                            viewMode === "month"
                                ? "max-h-[500px]"
                                : "max-h-[120px]"
                        }`}
                    >
                        {viewMode === "month" ? (
                            <MonthView
                                calendarMatrix={calendarMatrix}
                                selectedDay={selectedDay}
                                onSelectDay={onSelectDay}
                                onChangeMonth={onChangeMonth} 
                                todayStr={todayStr}
                            />
                        ) : (
                            <WeekView
                                week={getWeekOf(selectedDay?.date)}
                                selectedDay={selectedDay}
                                onSelectDay={onSelectDay}
                                onChangeMonth={onChangeMonth} 
                                todayStr={todayStr}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
