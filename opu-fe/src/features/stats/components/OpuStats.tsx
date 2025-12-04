"use client";

import { useEffect, useState, type FC } from "react";
import { Icon } from "@iconify/react";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";
import { CATEGORY_MAP, OpuCardModel } from "@/features/opu/domain";
import StatsCalendar from "./StatsCalendar";
import OpuRankingList from "./OpuRankingList";
import { fetchMyOpuList } from "@/features/opu/service";
import { getBlockedOpuList } from "@/features/blocked-opu/services";
import { toastError } from "@/lib/toast";

type Props = {
    year: number;
    month: number;
};

const OpuStats: FC<Props> = ({ year, month }) => {
    const [activeFilter, setActiveFilter] = useState("all");
    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    const [items, setItems] = useState<OpuCardModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // year/month 기준으로 캘린더 데이터 생성
    useEffect(() => {
        const data = getMonthlyCalendar(year, month);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCalendarMatrix(buildCalendarMatrix(data));
    }, [year, month]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                // TODO: 페이지 디자인용 API로, 실제 랭킹 API 연동 필요
                const data = await getBlockedOpuList();
                setItems(data);
            } catch (err) {
                console.error(err);
                toastError("OPU 랭킹을 불러오지 못했어요.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
        <div className="space-y-4">
            {/* 상단 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* 전체 */}
                <button
                    onClick={() => setActiveFilter("all")}
                    className="flex items-center gap-1 rounded-full border border-[var(--color-opu-pink)] px-3 py-1 whitespace-nowrap transition-colors"
                    style={{
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "var(--text-caption)",
                        background:
                            activeFilter === "all"
                                ? "var(--color-opu-pink)"
                                : "#ffffff",
                        color:
                            activeFilter === "all"
                                ? "#ffffff"
                                : "var(--color-super-dark-gray)",
                    }}
                >
                    전체
                </button>

                {/* 카테고리 기반 필터 */}
                {Object.entries(CATEGORY_MAP).map(([id, label]) => {
                    const isActive = activeFilter === id;

                    return (
                        <button
                            key={id}
                            onClick={() => setActiveFilter(id)}
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
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* 요약 카드 */}
            <section className="grid grid-cols-3 gap-2">
                <StatsCard
                    title="전체 달성률"
                    value="86%"
                    icon="uil:calendar"
                    color="#FF9CB9"
                    background="#FFECF1"
                />
                <StatsCard
                    title="연속 완료"
                    value="12"
                    icon="solar:fire-bold"
                    suffix="일"
                    color="#FFA061"
                    background="#FFF0E6"
                />
                <StatsCard
                    title="완료"
                    value="47"
                    icon="lets-icons:check-fill"
                    suffix="회"
                    color="#48EA8A"
                    background="#EAF9EE"
                />
            </section>

            {/* 캘린더 - 공용 StatsCalendar 사용 */}
            <StatsCalendar
                calendarMatrix={calendarMatrix}
                todayStr={todayStr}
            />

            <OpuRankingList initialItems={items} />
        </div>
    );
};

export default OpuStats;

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

            {/* 값 */}
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
