"use client";

import { useState, useEffect } from "react";

import RoutineStats from "../components/RoutineStats";
import OpuStats from "../components/OpuStats";
import StatsMonthPicker from "../components/StatsMonthPicker";
import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";

type StatsTab = "ROUTINE" | "OPU";
const TAB_STORAGE_KEY = "stats_current_tab";

export default function StatsPage() {
    const [currentTab, setCurrentTab] = useState<StatsTab>("ROUTINE");
    const [hasHydrated, setHasHydrated] = useState(false);

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const saved = window.sessionStorage.getItem(TAB_STORAGE_KEY);
        if (saved === "ROUTINE" || saved === "OPU") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentTab(saved);
        }
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);

        const data = getMonthlyCalendar(year, month);
        setCalendarData(data);
        setCalendarMatrix(buildCalendarMatrix(data));

        setLoading(false);
    }, [year, month]);

    const handleChangeTab = (tab: StatsTab) => {
        setCurrentTab(tab);
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem(TAB_STORAGE_KEY, tab);
        }
    };

    return (
        <div>
            {/* 월 선택 영역 */}
            <StatsMonthPicker
                year={year}
                month={month}
                onPrev={() => {
                    if (month === 1) {
                        setYear((y) => y - 1);
                        setMonth(12);
                    } else {
                        setMonth((m) => m - 1);
                    }
                }}
                onNext={() => {
                    if (month === 12) {
                        setYear((y) => y + 1);
                        setMonth(1);
                    } else {
                        setMonth((m) => m + 1);
                    }
                }}
            />

            {/* 탭 */}
            <nav className="w-full mt-4 border-b border-[var(--color-super-light-gray)]">
                <div className="grid grid-cols-2">
                    <button
                        type="button"
                        onClick={() => handleChangeTab("ROUTINE")}
                        className="relative pb-3 cursor-pointer"
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        루틴
                        <span
                            className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full transition-colors ${
                                hasHydrated && currentTab === "ROUTINE"
                                    ? "bg-[var(--color-opu-pink)]"
                                    : "bg-transparent"
                            }`}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChangeTab("OPU")}
                        className="relative pb-3 cursor-pointer"
                        style={{
                            fontWeight: "var(--weight-semibold)",
                            fontSize: "var(--text-sub)",
                        }}
                    >
                        OPU
                        <span
                            className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full transition-colors ${
                                hasHydrated && currentTab === "OPU"
                                    ? "bg-[var(--color-opu-pink)]"
                                    : "bg-transparent"
                            }`}
                        />
                    </button>
                </div>
            </nav>

            {/* 탭 내용 */}
            <main className="w-full pb-10 pt-4">
                {!hasHydrated ? (
                    <RoutineStats routineId={0} year={year} month={month} />
                ) : currentTab === "ROUTINE" ? (
                    <RoutineStats
                        routineId={0}
                        year={year}
                        month={month}
                        loading={loading}
                    />
                ) : (
                    <OpuStats year={year} month={month} />
                )}
            </main>
        </div>
    );
}
