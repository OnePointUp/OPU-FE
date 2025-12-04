"use client";

import type { FC } from "react";
import MonthView from "@/features/main/components/MonthView";
import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { WEEKDAYS } from "../types";

type StatsCalendarProps = {
    calendarMatrix: (DailyTodoStats | null)[][];
    todayStr: string;
};

const StatsCalendar: FC<StatsCalendarProps> = ({
    calendarMatrix,
    todayStr,
}) => {
    return (
        <section className="mt-2 rounded-xl border border-[var(--color-super-light-gray)] bg-white px-4 pb-4 pt-1 flex justify-center">
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

                {/* 월간 캘린더 */}
                <MonthView
                    calendarMatrix={calendarMatrix}
                    todayStr={todayStr} // 여기 원래 null 넣어놨던 거 실제 값으로 넘겨줌
                    selectedDay={null}
                    onSelectDay={() => {}}
                />
            </div>
        </section>
    );
};

export default StatsCalendar;
