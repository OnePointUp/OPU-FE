"use client";

import { useEffect, useState, type FC } from "react";
import { Icon } from "@iconify/react";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";
import { OpuCardModel } from "@/features/opu/domain";
import StatsCalendar from "./StatsCalendar";
import OpuRankingList from "./OpuRankingList";
import { getBlockedOpuList } from "@/features/blocked-opu/services";
import { toastError } from "@/lib/toast";

type Props = {
    year: number;
    month: number;
    loading: boolean;
};

const OpuStats: FC<Props> = ({ year, month, loading }) => {
    const [calendarMatrix, setCalendarMatrix] = useState<
        (DailyTodoStats | null)[][]
    >([]);

    const [items, setItems] = useState<OpuCardModel[]>([]);

    // year/month 기준으로 캘린더 데이터 생성
    useEffect(() => {
        const data = getMonthlyCalendar(year, month);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCalendarMatrix(buildCalendarMatrix(data));
    }, [year, month]);

    useEffect(() => {
        const load = async () => {
            try {
                // TODO: 페이지 디자인용 API로, 실제 랭킹 API 연동 필요
                const data = await getBlockedOpuList();
                setItems(data);
            } catch (err) {
                console.error(err);
                toastError("OPU 랭킹을 불러오지 못했어요.");
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
                            title="랜덤 OPU"
                            value="86"
                            icon="famicons:dice-outline"
                            suffix="개"
                            color="#FF9CB9"
                            background="#FFECF1"
                        />
                        <StatsCard
                            title="총 달성일"
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
                    </>
                )}
            </section>

            {/* 캘린더 */}
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
