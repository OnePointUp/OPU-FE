"use client";

import type { FC } from "react";
import { CalendarCell, WEEKDAYS } from "../types";
import StatsMonthView from "./StatsMonthView";

type StatsCalendarProps = {
    calendarMatrix: (CalendarCell | null)[][];
    todayStr: string;
    loading?: boolean;
};

const StatsCalendar: FC<StatsCalendarProps> = ({
    calendarMatrix,
    todayStr,
    loading,
}) => {
    return (
        <section className="mt-2 rounded-xl border border-[var(--color-super-light-gray)] bg-white px-4 pb-4 pt-1 flex justify-center">
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

                {/* 월간 캘린더 */}
                <StatsMonthView
                    calendarMatrix={calendarMatrix}
                    todayStr={todayStr}
                    selectedDay={null}
                    onSelectDay={() => {}}
                    loading={loading}
                />
            </div>
        </section>
    );
};

export default StatsCalendar;
