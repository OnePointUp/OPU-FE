"use client";

import { useEffect, useState, type FC } from "react";
import { Icon } from "@iconify/react";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";
import StatsCalendar from "./StatsCalendar";

// 목데이터
const FILTERS = [
    { key: "all", title: "전체", emoji: "none" },
    { key: "water", title: "물 2L 마시기", emoji: "💧" },
    { key: "walk", title: "산책하기", emoji: "🙂" },
];

type RoutineStatsProps = {
    year: number;
    month: number;
    loading?: boolean;
};

const RoutineStats: FC<RoutineStatsProps> = ({ year, month, loading }) => {
    const [activeFilter, setActiveFilter] = useState("all");

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

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
        <div className="space-y-4">
            {/* 상단 필터 (TODO: 실제 데이터 기준으로 변경) */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {FILTERS.map((f) => {
                    const isActive = activeFilter === f.key;

                    if (loading) return null;

                    return (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className="flex items-center gap-1 rounded-full border border-[var(--color-opu-pink)] px-3 py-1 whitespace-nowrap transition-colors"
                            style={{
                                fontWeight: "var(--weight-semibold)",
                                fontSize: "var(--text-caption)",
                                background: isActive
                                    ? "var(--color-opu-pink)"
                                    : "#ffffff",
                                color: isActive
                                    ? "#ffffff"
                                    : "var(--color-super-dark-gray)",
                            }}
                        >
                            {f.emoji !== "none" && (
                                <span className="text-base leading-none">
                                    {f.emoji}
                                </span>
                            )}
                            {f.title}
                        </button>
                    );
                })}
            </div>

            {/* 요약 카드 */}
            <section className="grid grid-cols-3 gap-2">
                {loading ? (
                    <>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-super-light-gray)] bg-white py-3 text-center"
                            >
                                {/* 아이콘 */}
                                <div className="skeleton rounded-full w-9 h-9 mb-3" />

                                {/* 값 */}
                                <div className="skeleton h-5 w-10 mb-1" />

                                {/* 타이틀 */}
                                <div className="skeleton h-3 w-14" />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="전체 달성률"
                            value="86%"
                            icon="uil:calendar"
                            color="#FF9CB9"
                            background="#FFECF1"
                        />
                        <StatsCard
                            title="연속 성공"
                            value="12"
                            icon="solar:fire-bold"
                            suffix="일"
                            color="#FFA061"
                            background="#FFF0E6"
                        />
                        <StatsCard
                            title="완료"
                            value="26"
                            icon="lets-icons:check-fill"
                            suffix="회"
                            color="#48EA8A"
                            background="#EAF9EE"
                        />
                    </>
                )}
            </section>

            {/* 캘린더 */}
            <StatsCalendar
                calendarMatrix={calendarMatrix}
                todayStr={todayStr}
            />
        </div>
    );
};

export default RoutineStats;

type StatsCardProps = {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    background: string;
    suffix?: string;
};

function StatsCard({
    title,
    value,
    icon,
    color,
    background,
    suffix,
}: StatsCardProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-super-light-gray)] bg-white py-2 text-center">
            {/* 아이콘 */}
            <span
                className="flex items-center justify-center p-2 rounded-full mb-2"
                style={{
                    background,
                    color,
                }}
            >
                {icon && <Icon icon={icon} width="21" height="21" />}
            </span>

            {/* 달성도 */}
            <p
                style={{
                    fontSize: "var(--text-body)",
                    fontWeight: "var(--weight-semibold)",
                }}
            >
                {value}
                {suffix && (
                    <span
                        className="ml-[1px]"
                        style={{
                            fontSize: "var(--text-caption)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        {suffix}
                    </span>
                )}
            </p>

            {/* 타이틀 */}
            <p
                className="mb-1"
                style={{
                    fontSize: "var(--text-mini)",
                    color: "var(--color-dark-gray)",
                    fontWeight: "var(--weight-medium)",
                }}
            >
                {title}
            </p>
        </div>
    );
}
