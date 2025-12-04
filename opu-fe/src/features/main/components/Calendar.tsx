"use client";

import { useState, useEffect } from "react";
import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";

import DaySelector from "./DaySelector";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import { WEEKDAYS } from "@/features/stats/types";

type Props = {
    selectedDay: DailyTodoStats | null;
    onSelectDay: (day: DailyTodoStats) => void;
};

export default function MonthlyCalendar({ selectedDay, onSelectDay }: Props) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    const [viewMode, setViewMode] = useState<"month" | "week">("month");

    const [tempSelectedDate, setTempSelectedDate] = useState<{
        y: number;
        m: number;
        d: number;
    } | null>(null);

    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // 📌 월이 바뀔 때 캘린더 즉시 생성
    useEffect(() => {
        const data = getMonthlyCalendar(year, month);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCalendarData(data);
        setCalendarMatrix(buildCalendarMatrix(data));
    }, [year, month]);

    // 📌 날짜 변경 반영
    useEffect(() => {
        if (!tempSelectedDate) return;

        const { y, m, d } = tempSelectedDate;
        const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(
            d
        ).padStart(2, "0")}`;

        const found = calendarData.find((day) => day.date === dateStr);
        if (found) onSelectDay(found);
    }, [tempSelectedDate, calendarData, onSelectDay]);

    const handleDateSelect = (y: number, m: number, d: number) => {
        setTempSelectedDate({ y, m, d });
        setYear(y);
        setMonth(m);
    };

    const getWeekOf = (
        dateStr: string | undefined
    ): (DailyTodoStats | null)[] => {
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
                    tempSelectedDate
                        ? tempSelectedDate.d
                        : selectedDay
                        ? new Date(selectedDay.date).getDate()
                        : 1
                }
                onSelect={handleDateSelect}
                onToggleView={() =>
                    setViewMode(viewMode === "month" ? "week" : "month")
                }
                viewMode={viewMode}
            />

            {/* StatsCalendar 스타일로 감싸는 캘린더 카드 */}
            <section className="mt-1 rounded-xl border border-[var(--color-super-light-gray)] bg-white px-4 py-3 flex justify-center">
                {/* 가운데 정렬 + 반응형 너비 */}
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
                                todayStr={todayStr}
                            />
                        ) : (
                            <WeekView
                                week={getWeekOf(selectedDay?.date)}
                                selectedDay={selectedDay}
                                onSelectDay={onSelectDay}
                                todayStr={todayStr}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
