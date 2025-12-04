"use client";

import { useEffect, useState, type FC } from "react";
import MonthView from "@/features/main/components/MonthView";
import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";
import { WEEKDAYS } from "../types";

type Props = {
    year: number;
    month: number;
};

const OpuStats: FC<Props> = ({ year, month }) => {
    const { selectedDay, selectDay } = useCalendarCore();

    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    // 🔹 year/month 기준으로 캘린더 데이터 생성
    useEffect(() => {
        const data = getMonthlyCalendar(year, month);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCalendarMatrix(buildCalendarMatrix(data));
    }, [year, month]);

    const handleSelectDay = (day: DailyTodoStats) => {
        selectDay(day);
    };

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
        <div className="space-y-4">
            {/* 요약 카드 3개 */}
            <section className="grid grid-cols-3 gap-2 px-[2px]">
                <StatsCard title="전체 달성률" value="86%" />
                <StatsCard title="연속 완료" value="12" suffix="일" />
                <StatsCard title="총 완료" value="47" suffix="회" />
            </section>

            <StatsCalendar
                calendarMatrix={calendarMatrix}
                selectedDay={selectedDay}
                onSelectDay={handleSelectDay}
                todayStr={todayStr}
            />
        </div>
    );
};

export default OpuStats;

type StatsCardProps = {
    title: string;
    value: string | number;
    suffix?: string;
};

function StatsCard({ title, value, suffix }: StatsCardProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-super-light-gray)] bg-white py-3 text-center shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
            <p className="mb-2 text-[11px] text-[var(--color-text-subtle)]">
                {title}
            </p>
            <p className="text-[20px] font-semibold">
                {value}
                {suffix && (
                    <span className="ml-[1px] text-[12px] font-medium">
                        {suffix}
                    </span>
                )}
            </p>
        </div>
    );
}

type StatsCalendarProps = {
    calendarMatrix: (DailyTodoStats | null)[][];
    selectedDay: DailyTodoStats | null;
    onSelectDay: (day: DailyTodoStats) => void;
    todayStr: string;
};

const StatsCalendar: FC<StatsCalendarProps> = ({
    calendarMatrix,
    selectedDay,
    onSelectDay,
    todayStr,
}) => {
    return (
        <section className="mt-2 rounded-3xl border border-[var(--color-super-light-gray)] bg-white px-4 pb-4 pt-3">
            {/* 요일 */}
            <div className="grid grid-cols-7 mb-2 gap-2 inline-grid">
                {WEEKDAYS.map((day) => (
                    <div
                        key={day}
                        className={`w-10 h-10 flex items-center justify-center text-sm ${
                            day === "일"
                                ? "[var(--color-sunday)]"
                                : "text-[var(--color-dark-gray)]"
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* 월간 캘린더 */}
            <MonthView
                calendarMatrix={calendarMatrix}
                selectedDay={selectedDay}
                onSelectDay={onSelectDay}
                todayStr={todayStr}
            />
        </section>
    );
};
