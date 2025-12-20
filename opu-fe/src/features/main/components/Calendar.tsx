"use client";

import { useState, useRef, useEffect } from "react";

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

    const [viewMode, setViewMode] = useState<"month" | "week">("week");

    const [containerHeight, setContainerHeight] = useState<number | "auto">(49);
    const contentRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(true);

    // 선택한 날짜가 속한 주를 찾는 함수
    const getWeekOf = (dateStr: string | undefined): (CalendarDay | null)[] => {
        if (!dateStr) return calendarMatrix[0] ?? [];
        for (const week of calendarMatrix) {
            if (week.some((d) => d?.date === dateStr)) return week;
        }
        return calendarMatrix[0] ?? [];
    };

    // 스켈레톤
    useEffect(() => {
        if (calendarMatrix.length > 0) {
            const t = setTimeout(() => setIsLoading(false), 150);
            return () => clearTimeout(t);
        }
    }, [calendarMatrix]);

    // 주, 월별 높이 계산
    useEffect(() => {
    if (!contentRef.current || isLoading) return;

    const active = contentRef.current.querySelector(
        `[data-view="${viewMode}"]`
    );

    if (active instanceof HTMLElement) {
        setContainerHeight(active.scrollHeight);
    }
    }, [viewMode, calendarMatrix, selectedDay, isLoading]);

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
            <section className="mt-1 rounded-xl border border-[var(--color-super-light-gray)] px-4 py-3 flex justify-center">
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
                    className="w-full overflow-hidden relative transition-[height] duration-300 ease-in-out"
                    style={{ height: `${containerHeight}px` }}
                    >
                    <div ref={contentRef} className="relative">

                        {/* ================= Skeleton (Week 기준) ================= */}
                        {isLoading && (
                        <div className="absolute inset-0 grid grid-cols-7 w-full gap-1.5 sm:gap-2.5 md:gap-3.5">
                            {Array.from({ length: 7 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="aspect-square rounded-xl bg-[var(--color-super-light-gray)] animate-pulse"
                            />
                            ))}
                        </div>
                        )}

                        {/* ================= Month ================= */}
                        <div
                        data-view="month"
                        className={`absolute inset-0 transition-all duration-300 ease-in-out
                            ${
                            viewMode === "month" && !isLoading
                                ? "opacity-100 scale-y-100"
                                : "opacity-0 scale-y-75 pointer-events-none"
                            }
                        `}
                        style={{ transformOrigin: "top" }}
                        >
                        <MonthView
                            calendarMatrix={calendarMatrix}
                            selectedDay={selectedDay}
                            onSelectDay={onSelectDay}
                            onChangeMonth={onChangeMonth}
                            todayStr={todayStr}
                        />
                        </div>

                        {/* ================= Week ================= */}
                        <div
                        data-view="week"
                        className={`absolute inset-0 transition-all duration-300 ease-in-out
                            ${
                            viewMode === "week" && !isLoading
                                ? "opacity-100 scale-y-100"
                                : "opacity-0 scale-y-75 pointer-events-none"
                            }
                        `}
                        style={{ transformOrigin: "top" }}
                        >
                        <WeekView
                            week={getWeekOf(selectedDay?.date)}
                            selectedDay={selectedDay}
                            onSelectDay={onSelectDay}
                            onChangeMonth={onChangeMonth}
                            todayStr={todayStr}
                        />
                        </div>

                    </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
