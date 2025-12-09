"use client";

import { useEffect, useState, type FC } from "react";
import { Icon } from "@iconify/react";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";
import StatsCalendar from "./StatsCalendar";
import OpuRankingList from "./OpuRankingList";
import { toastError } from "@/lib/toast";
import { mapMinutesToLabel, type OpuCardModel } from "@/features/opu/domain";
import { OpuMonthlyStatsResponse } from "../types";
import { fetchMonthlyOpuStats } from "../services";

type Props = {
    year: number;
    month: number;
};

const OpuStats: FC<Props> = ({ year, month }) => {
    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    // 월별 통계 상태
    const [stats, setStats] = useState<OpuMonthlyStatsResponse | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const [rankingItems, setRankingItems] = useState<OpuCardModel[]>([]);

    // year/month 기준 캘린더 (지금은 mock 그대로 사용)
    useEffect(() => {
        const data = getMonthlyCalendar(year, month);
        setCalendarMatrix(buildCalendarMatrix(data));
    }, [year, month]);

    // 월별 OPU 통계 불러오기
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingStats(true);
            try {
                const res = await fetchMonthlyOpuStats({ year, month });
                if (cancelled) return;

                setStats(res);

                // 랭킹용 리스트로 매핑 (OpuCardModel)
                const mapped: OpuCardModel[] = res.topCompletedOpus.map(
                    (o) => ({
                        id: o.opuId,
                        title: o.title,
                        description: "",

                        emoji: o.emoji,
                        categoryId: 0, // 실제 id 없으니 일단 0
                        categoryName: o.categoryName,

                        timeLabel: mapMinutesToLabel(o.requiredMinutes),

                        completedCount: o.completedCount,
                        isShared: true,

                        isLiked: false,
                        likeCount: 0,

                        creatorId: undefined,
                        creatorNickname: undefined,

                        shareLabel: undefined,
                        createdAt: undefined,
                        isMine: undefined,
                        blockedAt: undefined,
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
