"use client";

import { useEffect, useState, type FC } from "react";
import { Icon } from "@iconify/react";

import StatsCalendar from "./StatsCalendar";
import OpuRankingList from "./OpuRankingList";
import { toastError } from "@/lib/toast";
import { mapMinutesToLabel, type OpuCardModel } from "@/features/opu/domain";
import {
    CalendarCell,
    OpuCalendarDayDto,
    OpuMonthlyStatsResponse,
} from "../types";
import { fetchMonthlyOpuStats, fetchOpuCalendar } from "../services";

type Props = {
    year: number;
    month: number;
};

const OpuStats: FC<Props> = ({ year, month }) => {
    const [calendarMatrix, setCalendarMatrix] = useState<
        (CalendarCell | null)[][]
    >([]);

    const [stats, setStats] = useState<OpuMonthlyStatsResponse | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingCalendar, setLoadingCalendar] = useState(true);

    const [rankingItems, setRankingItems] = useState<OpuCardModel[]>([]);

    // 월별 OPU 통계
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingStats(true);
            try {
                const res = await fetchMonthlyOpuStats({ year, month });
                if (cancelled) return;

                setStats(res);

                const mapped: OpuCardModel[] = res.topCompletedOpus.map(
                    (o) => ({
                        id: o.opuId,
                        title: o.title,

                        emoji: o.emoji,
                        categoryName: o.categoryName,

                        timeLabel: mapMinutesToLabel(o.requiredMinutes),

                        completedCount: o.completedCount,
                    })
                );

                setRankingItems(mapped);
            } catch (err) {
                console.error(err);
                toastError("OPU 통계를 불러오지 못했어요.");
            } finally {
                if (!cancelled) setLoadingStats(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [year, month]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingCalendar(true);
            try {
                const res = await fetchOpuCalendar({ year, month });
                if (cancelled) return;

                const matrix = buildOpuCalendarMatrix(
                    res.year,
                    res.month,
                    res.days
                );
                setCalendarMatrix(matrix);
            } catch (err) {
                console.error(err);
                toastError("OPU 캘린더를 불러오지 못했어요.");
            } finally {
                if (!cancelled) setLoadingCalendar(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [year, month]);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const completedDayCount = stats?.completedDayCount ?? 0;
    const completedOpuCount = stats?.completedOpuCount ?? 0;
    const randomDrawCount = stats?.randomDrawCount ?? 0;

    return (
        <div className="space-y-4">
            {/* 요약 카드 */}
            <section className="grid grid-cols-3 gap-2">
                {loadingStats ? (
                    <>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-super-light-gray)] bg-white py-3 text-center"
                            >
                                <div className="skeleton rounded-full w-9 h-9 mb-3" />
                                <div className="skeleton h-5 w-10 mb-1" />
                                <div className="skeleton h-3 w-14" />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <StatsCard
                            title="랜덤 OPU"
                            value={randomDrawCount}
                            icon="famicons:dice-outline"
                            suffix="회"
                            color="#FF9CB9"
                            background="#FFECF1"
                        />
                        <StatsCard
                            title="총 달성일"
                            value={completedDayCount}
                            icon="solar:fire-bold"
                            suffix="일"
                            color="#FFA061"
                            background="#FFF0E6"
                        />
                        <StatsCard
                            title="완료"
                            value={completedOpuCount}
                            icon="lets-icons:check-fill"
                            suffix="회"
                            color="#48EA8A"
                            background="#EAF9EE"
                        />
                    </>
                )}
            </section>

            {/* 캘린더 (지금은 mock 기준) */}
            <StatsCalendar
                calendarMatrix={calendarMatrix}
                todayStr={todayStr}
                loading={loadingCalendar}
            />

            {/* OPU 랭킹 */}
            <OpuRankingList initialItems={rankingItems} />
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
            <span
                className="flex items-center justify-center p-2 rounded-full mb-2"
                style={{
                    background,
                    color,
                }}
            >
                {icon && <Icon icon={icon} width="21" height="21" />}
            </span>

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

function buildOpuCalendarMatrix(
    year: number,
    month: number,
    days: OpuCalendarDayDto[]
): (CalendarCell | null)[][] {
    const map = new Map<string, number>();
    days.forEach((d) => {
        map.set(d.date, d.completedCount);
    });

    const firstDate = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDate.getDay(); // 0: 일 ~ 6: 토
    const lastDate = new Date(year, month, 0).getDate(); // 말일

    const weeks: (CalendarCell | null)[][] = [];
    let currentWeek: (CalendarCell | null)[] = [];

    // 앞쪽 빈 칸
    for (let i = 0; i < firstDayOfWeek; i += 1) {
        currentWeek.push(null);
    }

    // 1일부터 말일까지 채우기
    for (let day = 1; day <= lastDate; day += 1) {
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        const mm = String(month).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        const dateStr = `${year}-${mm}-${dd}`;
        const count = map.get(dateStr) ?? 0;

        const intensity = getIntensityFromCount(count);

        const cell: CalendarCell = {
            date: dateStr,
            completedCount: count,
            intensity,
        };

        currentWeek.push(cell);
    }

    // 마지막 주 뒤쪽 빈 칸
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    return weeks;
}

function getIntensityFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
}
