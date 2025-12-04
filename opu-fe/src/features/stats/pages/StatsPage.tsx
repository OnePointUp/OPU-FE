"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import RoutineStats from "../components/RoutineStats";
import OpuStats from "../components/OpuStats";
import Calendar from "@/features/main/components/Calendar";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";

type StatsTab = "ROUTINE" | "OPU";

export default function StatsPage() {
    const [currentTab, setCurrentTab] = useState<StatsTab>("ROUTINE");

    // TODO: 실제 현재 월/이전/다음 월 로직은 나중에 훅으로 분리
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

    const sortTodos = (todos: DailyTodoStats["todos"]) => {
        return [...todos].sort((a, b) => {
            if (a.done === b.done) return a.id - b.id;
            return a.done ? 1 : -1;
        });
    };

    /** 날짜 선택 */
    const handleSelectDay = (day: DailyTodoStats) => {
        const date = new Date(day.date);

        setSelectedDay({
            ...day,
            todos: sortTodos(day.todos),
        });

        setYear(date.getFullYear());
        setMonth(date.getMonth() + 1);
        setEditingTodoId(null);
    };
    return (
        <div className="min-h-[100svh] bg-[var(--background)]">
            <Calendar selectedDay={selectedDay} onSelectDay={handleSelectDay} />

            {/* 월 선택 영역 */}
            <section className="flex items-center justify-center gap-4 px-6">
                <button
                    type="button"
                    className="p-2"
                    aria-label="이전 달"
                    // TODO: prev month
                >
                    <Icon icon="mingcute:left-line" width={18} height={18} />
                </button>
                <p className="text-[18px] font-semibold">
                    {year}년 {month}월
                </p>
                <button
                    type="button"
                    className="p-2"
                    aria-label="다음 달"
                    // TODO: next month
                >
                    <Icon icon="mingcute:right-line" width={18} height={18} />
                </button>
            </section>

            {/* 탭 */}
            <nav className="mt-4 border-b border-[var(--color-super-light-gray)] px-6">
                <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={() => setCurrentTab("ROUTINE")}
                        className={`relative pb-3 text-sm ${
                            currentTab === "ROUTINE"
                                ? "font-semibold text-[var(--color-text-strong)]"
                                : "text-[var(--color-text-subtle)]"
                        }`}
                    >
                        루틴
                        {currentTab === "ROUTINE" && (
                            <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[var(--color-opu-pink)]" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrentTab("OPU")}
                        className={`relative pb-3 text-sm ${
                            currentTab === "OPU"
                                ? "font-semibold text-[var(--color-text-strong)]"
                                : "text-[var(--color-text-subtle)]"
                        }`}
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
