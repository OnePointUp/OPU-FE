"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import StatsCalendar from "./StatsCalendar";
import StatsMonthView from "./StatsMonthView";
import {
    CALENDAR_COLORS,
    CalendarCell,
    RoutineCalendarDayDto,
    RoutineCalendarResponse,
    RoutineFilterItem,
    RoutineMonthlyStatsResponse,
} from "../types";
import {
    fetchRoutineCalendar,
    fetchMonthlyRoutineStatsOverview,
    fetchRoutineListForStats,
    fetchMonthlyRoutineStats,
} from "../services";
import { toastError } from "@/lib/toast";
import SpinnerOverlay from "@/components/common/SpinnerOverlay";

type RoutineStatsProps = {
    routineId: number;
    year: number;
    month: number;
    loading?: boolean;
};

type ActiveFilter = "all" | number;

const RoutineStats = ({ routineId, year, month }: RoutineStatsProps) => {
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

    const [stats, setStats] = useState<RoutineCalendarResponse | null>(null);

    const [monthlyStats, setMonthlyStats] =
        useState<RoutineMonthlyStatsResponse | null>(null);

    const [calendarMatrix, setCalendarMatrix] = useState<
        (CalendarCell | null)[][]
    >([]);

    const [loadingDetail, setLoadingDetail] = useState(false);

    const [routines, setRoutines] = useState<RoutineFilterItem[]>([]);
    const [loadingRoutines, setLoadingRoutines] = useState(true);

    const [overviewItems, setOverviewItems] = useState<
        RoutineCalendarResponse[]
    >([]);
    const [loadingOverview, setLoadingOverview] = useState(true);

    // 루틴 목록
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingRoutines(true);
            try {
                const page = await fetchRoutineListForStats(0, 50);
                if (cancelled) return;

                const rawList = page.content ?? [];

                const normalized: RoutineFilterItem[] = rawList.map((r) => ({
                    id: r.routineId ?? r.id!,
                    title: r.title,
                }));

                setRoutines(normalized);

                if (routineId && normalized.some((r) => r.id === routineId)) {
                    setActiveFilter(routineId);
                }
            } catch (err) {
                console.error(err);
                toastError("루틴 목록을 불러오지 못했어요.");
            } finally {
                if (!cancelled) setLoadingRoutines(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [routineId]);

    // 모든 루틴 월간 통계 목록
    useEffect(() => {
        if (activeFilter !== "all") return;

        let cancelled = false;

        (async () => {
            setLoadingOverview(true);
            try {
                const items = await fetchMonthlyRoutineStatsOverview({
                    year,
                    month,
                    page: 0,
                    size: 10,
                });
                if (cancelled) return;
                setOverviewItems(items);
            } catch (err) {
                console.error(err);
                toastError("루틴 월별 통계(전체)를 불러오지 못했어요.");
            } finally {
                if (!cancelled) setLoadingOverview(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activeFilter, year, month]);

    // 단일 루틴 모드
    useEffect(() => {
        if (activeFilter === "all") {
            setStats(null);
            setMonthlyStats(null);
            setCalendarMatrix([]);
            return;
        }

        let cancelled = false;

        (async () => {
            setLoadingDetail(true);
            try {
                const [calendarRes, monthlyRes] = await Promise.all([
                    fetchRoutineCalendar({
                        routineId: activeFilter,
                        year,
                        month,
                    }),
                    fetchMonthlyRoutineStats({
                        routineId: activeFilter,
                        year,
                        month,
                    }),
                ]);

                if (cancelled) return;

                setStats(calendarRes);
                setMonthlyStats(monthlyRes);
                setCalendarMatrix(
                    buildRoutineCalendarMatrix(
                        calendarRes.year,
                        calendarRes.month,
                        calendarRes.days
                    )
                );
            } catch (err) {
                console.error(err);
                toastError("루틴 월별 통계를 불러오지 못했어요.");
            } finally {
                if (!cancelled) setLoadingDetail(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activeFilter, year, month]);

    const today = useMemo(() => new Date(), []);
    const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const routineColor = stats?.color ?? "#B8DD7C";
    const hasRoutines = routines.length > 0;
    const showEmptyRoutines = !loadingRoutines && !hasRoutines;
    const showNoStats =
        !loadingOverview &&
        !loadingRoutines &&
        hasRoutines &&
        overviewItems.length === 0;

    return (
        <div className="space-y-4">
            {/* 상단 필터: 전체 + 루틴 목록 */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* 전체 */}
                <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className="flex items-center gap-1 rounded-full border border-[var(--color-opu-pink)] px-3 py-1 whitespace-nowrap transition-colors cursor-pointer"
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

                {/* 개별 루틴들 */}
                {loadingRoutines
                    ? null
                    : routines.map((r) => {
                          const isActive = activeFilter === r.id;

                          return (
                              <button
                                  key={r.id}
                                  type="button"
                                  onClick={() => setActiveFilter(r.id)}
                                  className="flex items-center gap-1 rounded-full border border-[var(--color-opu-pink)] px-3 py-1 whitespace-nowrap transition-colors cursor-pointer"
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
                                  {r.title}
                              </button>
                          );
                      })}
            </div>

            {/* === 전체 모드 === */}
            {activeFilter === "all" && (
                <section className="grid grid-cols-2 gap-2 px-1 relative">
                    {loadingOverview && <SpinnerOverlay />}

                    {!loadingOverview && showEmptyRoutines ? (
                        <div className="col-span-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-super-light-gray)] bg-white py-10 text-center">
                            <p className="text-[var(--text-sub)] text-[var(--color-dark-gray)] font-[var(--weight-medium)]">
                                아직 설정된 루틴이 없습니다.
                            </p>
                            <p className="text-xs text-[var(--color-light-gray)]">
                                루틴을 등록하고 월별 통계를 확인해보세요.
                            </p>
                            <Link
                                href="/routine/register"
                                className="inline-flex items-center justify-center rounded-full bg-[var(--color-opu-pink)] px-4 py-2 text-white text-[13px] font-[var(--weight-semibold)] shadow-sm"
                            >
                                루틴 등록하기
                            </Link>
                        </div>
                    ) : !loadingOverview && showNoStats ? (
                        <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--color-super-light-gray)] bg-white py-8 text-center">
                            <p className="text-[var(--text-sub)] text-[var(--color-dark-gray)] font-[var(--weight-medium)]">
                                선택한 기간의 통계가 아직 없어요.
                            </p>
                            <p className="text-xs text-[var(--color-light-gray)]">
                                루틴을 꾸준히 완료하면 통계가 채워집니다.
                            </p>
                        </div>
                    ) : !loadingOverview ? (
                        overviewItems.map((item) => (
                            <RoutineOverviewCard
                                key={item.routineId}
                                item={item}
                                onSelect={() => setActiveFilter(item.routineId)}
                            />
                        ))
                    ) : null}
                </section>
            )}

            {/* === 단일 루틴 모드 === */}
            {activeFilter !== "all" && (
                <>
                    {/* 요약 카드 */}
                    <section className="grid grid-cols-3 gap-2">
                        {loadingDetail || !monthlyStats ? (
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
                                    title="달성률"
                                    value={monthlyStats.achievementRate}
                                    icon="uil:calendar"
                                    suffix="%"
                                    color="#FF9CB9"
                                    background="#FFECF1"
                                />
                                <StatsCard
                                    title="연속 성공"
                                    value={monthlyStats.streakDays}
                                    icon="solar:fire-bold"
                                    suffix="일"
                                    color="#FFA061"
                                    background="#FFF0E6"
                                />
                                <StatsCard
                                    title="완료"
                                    value={monthlyStats.completedCount}
                                    icon="lets-icons:check-fill"
                                    suffix="회"
                                    color="#48EA8A"
                                    background="#EAF9EE"
                                />
                            </>
                        )}
                    </section>

                    <StatsCalendar
                        calendarMatrix={calendarMatrix}
                        todayStr={todayStr}
                        loading={loadingDetail}
                        getCellBackground={(cell) =>
                            cell.hasTodo && cell.done
                                ? routineColor
                                : CALENDAR_COLORS[0]
                        }
                    />
                </>
            )}
        </div>
    );
};

export default RoutineStats;

/* ===== 공통 카드 컴포넌트 ===== */

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

/* ===== 전체 루틴 카드 ===== */

function RoutineOverviewCard({
    item,
    onSelect,
}: {
    item: RoutineCalendarResponse;
    onSelect: () => void;
}) {
    const matrix = buildRoutineCalendarMatrix(item.year, item.month, item.days);
    const { successRate, successCount } = calcRoutineMonthlyStats(item.days);

    return (
        <article
            onClick={onSelect}
            role="button"
            className="cursor-pointer rounded-xl border border-[var(--color-super-light-gray)] bg-white px-2 pt-2.5 pb-2 flex flex-col gap-2"
        >
            <p
                className="text-center"
                style={{
                    fontSize: "var(--text-caption)",
                    fontWeight: "var(--weight-semibold)",
                }}
            >
                {item.title}
            </p>

            <StatsMonthView
                calendarMatrix={matrix}
                todayStr={null}
                selectedDay={null}
                onSelectDay={() => {}}
                loading={false}
                showDateNumber={false}
                cellClassName="rounded-sm"
                containerClassName="grid grid-cols-7 w-full gap-0.5 sm:gap-1 md:gap-1.5"
                getCellBackground={(cell) =>
                    cell.hasTodo && cell.done ? item.color : CALENDAR_COLORS[0]
                }
            />

            <div className="mt-1 flex items-center justify-center gap-10 text-[var(--color-dark-gray)]">
                <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "var(--text-mini)" }}
                >
                    <Icon icon="mdi:progress-clock" width={14} height={14} />
                    {successRate}%
                </span>
                <span
                    className="flex items-center gap-1"
                    style={{ fontSize: "var(--text-mini)" }}
                >
                    <Icon icon="lets-icons:check-fill" width={14} height={14} />
                    {successCount}
                </span>
            </div>
        </article>
    );
}

/* ===== 공통 캘린더 매트릭스 / 통계 ===== */

function buildRoutineCalendarMatrix(
    year: number,
    month: number,
    days: RoutineCalendarDayDto[]
): (CalendarCell | null)[][] {
    const map = new Map<string, RoutineCalendarDayDto>();
    days.forEach((d) => {
        map.set(d.date, d);
    });

    const firstDate = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDate.getDay();
    const lastDate = new Date(year, month, 0).getDate();

    const weeks: (CalendarCell | null)[][] = [];
    let currentWeek: (CalendarCell | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i += 1) {
        currentWeek.push(null);
    }

    for (let day = 1; day <= lastDate; day += 1) {
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        const mm = String(month).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        const dateStr = `${year}-${mm}-${dd}`;

        const dto = map.get(dateStr);

        const cell: CalendarCell = {
            date: dateStr,
            hasTodo: dto?.hasTodo ?? false,
            done: dto?.done ?? false,
        };

        currentWeek.push(cell);
    }

    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    return weeks;
}

function calcRoutineMonthlyStats(days: RoutineCalendarDayDto[]) {
    const totalTodoDays = days.filter((d) => d.hasTodo).length;
    const successDays = days.filter((d) => d.hasTodo && d.done).length;

    const successRate =
        totalTodoDays === 0
            ? 0
            : Math.round((successDays / totalTodoDays) * 100);

    return {
        successRate,
        successCount: successDays,
    };
}
