"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import RoutineStats from "../components/RoutineStats";
import OpuStats from "../components/OpuStats";
import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";
import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";

type StatsTab = "ROUTINE" | "OPU";

export default function StatsPage() {
    const { selectedDay, selectDay } = useCalendarCore();

    const [currentTab, setCurrentTab] = useState<StatsTab>("ROUTINE");

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    useEffect(() => {
        const data = getMonthlyCalendar(year, month);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCalendarData(data);
        setCalendarMatrix(buildCalendarMatrix(data));
    }, [year, month]);

    const handleSelectDay = (day: DailyTodoStats) => {
        selectDay(day);
    };

    return (
        <div>
            {/* 월 선택 영역 */}
            <section className="flex items-center px-20">
                {/* 이전 달 */}
                <button
                    type="button"
                    className="p-2 shrink-0"
                    aria-label="이전 달"
                    onClick={() => {
                        if (month === 1) {
                            setYear((y) => y - 1);
                            setMonth(12);
                        } else {
                            setMonth((m) => m - 1);
                        }
                    }}
                >
                    <Icon
                        icon="mingcute:left-line"
                        width={18}
                        height={18}
                        color="var(--color-light-gray)"
                    />
                </button>

                {/* 년/월 텍스트 */}
                <p
                    className="flex-1 text-center"
                    style={{
                        fontSize: "var(--text-h3)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    {year}년 {month}월
                </p>

                {/* 다음 달 */}
                <button
                    type="button"
                    className="p-2 shrink-0"
                    aria-label="다음 달"
                    onClick={() => {
                        if (month === 12) {
                            setYear((y) => y + 1);
                            setMonth(1);
                        } else {
                            setMonth((m) => m + 1);
                        }
                    }}
                >
                    <Icon
                        icon="mingcute:right-line"
                        width={18}
                        height={18}
                        color="var(--color-light-gray)"
                    />
                </button>
            </section>

            {/* 탭 */}
            <nav className="w-full mt-4 border-b border-[var(--color-super-light-gray)]">
                <div className="grid grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setCurrentTab("ROUTINE")}
                        className="relative pb-3"
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        루틴
                        {currentTab === "ROUTINE" && (
                            <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[var(--color-opu-pink)]" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentTab("OPU")}
                        className="relative pb-3"
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        OPU
                        {currentTab === "OPU" && (
                            <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[var(--color-opu-pink)]" />
                        )}
                    </button>
                </div>
            </nav>

            {/* 탭 내용 */}
            <main className="px-4 pb-10 pt-4">
                {currentTab === "ROUTINE" ? (
                    <RoutineStats year={year} month={month} />
                ) : (
                    <OpuStats year={year} month={month} />
                )}
            </main>
        </div>
    );
}
