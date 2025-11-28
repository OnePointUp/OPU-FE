"use client";

import { useState } from "react";
import type React from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import type { RoutineFrequency } from "@/features/routine/domain";
import OpuActionButton from "@/components/common/OpuActionButton";

type Props = {
    initialFrequency: RoutineFrequency;
};

type ChipProps = {
    label: string;
    selected?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
};

function ToggleChip({ label, selected, fullWidth, onClick }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-[12px] mb-2 ${
                fullWidth ? "w-full" : "px-3"
            }`}
            style={{
                backgroundColor: selected ? "#000000" : "#F5F5F5",
                color: selected ? "#ffffff" : "var(--color-dark-navy)",
                fontSize: "var(--text-sub)",
                fontWeight: "var(--weight-regular)",
            }}
        >
            {label}
        </button>
    );
}

const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function RoutineFrequencyPage({ initialFrequency }: Props) {
    const router = useRouter();

    const [open, setOpen] = useState<RoutineFrequency | null>(null);

    const [selectedFrequency, setSelectedFrequency] =
        useState<RoutineFrequency>(initialFrequency);

    const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
    const [biWeeklyDays, setBiWeeklyDays] = useState<number[]>([]);
    const [monthlyDays, setMonthlyDays] = useState<number[]>([]);
    const [monthlyLast, setMonthlyLast] = useState(false);
    const [yearMonths, setYearMonths] = useState<number[]>([]);
    const [yearDays, setYearDays] = useState<number[]>([]);
    const [yearLast, setYearLast] = useState(false);

    const toggleSection = (freq: RoutineFrequency) => {
        setSelectedFrequency(freq);
        setOpen((prev) => (prev === freq ? null : freq));
    };

    const toggleInArray = (
        list: number[],
        value: number,
        setter: (v: number[]) => void
    ) => {
        setter(
            list.includes(value)
                ? list.filter((v) => v !== value)
                : [...list, value]
        );
    };

    const handleDone = () => {
        const params = new URLSearchParams();
        params.set("frequency", selectedFrequency);

        if (selectedFrequency === "WEEKLY") {
            params.set("days", weeklyDays.join(","));
        }
        if (selectedFrequency === "BIWEEKLY") {
            params.set("days", biWeeklyDays.join(","));
        }
        if (selectedFrequency === "MONTHLY") {
            if (monthlyLast) params.set("last", "true");
            else params.set("days", monthlyDays.join(","));
        }
        if (selectedFrequency === "YEARLY") {
            params.set("months", yearMonths.join(","));
            if (yearLast) params.set("last", "true");
            else params.set("days", yearDays.join(","));
        }

        router.push(`/routine/register?${params.toString()}`);
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "var(--text-body)",
        color: "var(--color-dark-navy)",
    };

    return (
        <div>
            {/* 매일 */}
            <section className="border-b border-[var(--color-super-light-gray)] pb-4.5 -mt-1 -mx-5">
                <button
                    type="button"
                    onClick={() => toggleSection("DAILY")}
                    className="w-full flex items-center justify-between px-5"
                >
                    <span
                        style={{
                            ...labelStyle,
                            fontWeight:
                                selectedFrequency === "DAILY"
                                    ? "var(--weight-semibold)"
                                    : "var(--weight-regular)",
                        }}
                    >
                        매일
                    </span>
                </button>
            </section>

            {/* 매주 */}
            <section className="border-b border-[var(--color-super-light-gray)] py-4.5 -mx-5">
                <button
                    type="button"
                    onClick={() => toggleSection("WEEKLY")}
                    className="w-full flex items-center justify-between px-5"
                >
                    <span
                        style={{
                            ...labelStyle,
                            fontWeight:
                                selectedFrequency === "WEEKLY"
                                    ? "var(--weight-semibold)"
                                    : "var(--weight-regular)",
                        }}
                    >
                        매주
                    </span>
                    <Icon
                        icon={
                            open === "WEEKLY"
                                ? "mdi:chevron-up"
                                : "mdi:chevron-down"
                        }
                        width={20}
                        height={20}
                        className="text-[var(--color-dark-gray)]"
                    />
                </button>

                {open === "WEEKLY" && (
                    <div className="mt-3 flex justify-between px-5">
                        {WEEK_LABELS.map((label, idx) => {
                            const dayIndex = idx + 1;
                            return (
                                <ToggleChip
                                    key={label}
                                    label={label}
                                    selected={weeklyDays.includes(dayIndex)}
                                    onClick={() =>
                                        toggleInArray(
                                            weeklyDays,
                                            dayIndex,
                                            setWeeklyDays
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            {/* 격주 */}
            <section className="border-b border-[var(--color-super-light-gray)] py-4.5 -mx-5">
                <button
                    type="button"
                    onClick={() => toggleSection("BIWEEKLY")}
                    className="w-full flex items-center justify-between px-5"
                >
                    <span
                        style={{
                            ...labelStyle,
                            fontWeight:
                                selectedFrequency === "BIWEEKLY"
                                    ? "var(--weight-semibold)"
                                    : "var(--weight-regular)",
                        }}
                    >
                        격주
                    </span>
                    <Icon
                        icon={
                            open === "BIWEEKLY"
                                ? "mdi:chevron-up"
                                : "mdi:chevron-down"
                        }
                        width={20}
                        height={20}
                        className="text-[var(--color-dark-gray)]"
                    />
                </button>

                {open === "BIWEEKLY" && (
                    <div className="mt-3 flex justify-between px-5">
                        {WEEK_LABELS.map((label, idx) => {
                            const dayIndex = idx + 1;
                            return (
                                <ToggleChip
                                    key={label}
                                    label={label}
                                    selected={biWeeklyDays.includes(dayIndex)}
                                    onClick={() =>
                                        toggleInArray(
                                            biWeeklyDays,
                                            dayIndex,
                                            setBiWeeklyDays
                                        )
                                    }
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            {/* 매월 */}
            <section className="border-b border-[var(--color-super-light-gray)] py-4.5 -mx-5">
                <button
                    type="button"
                    onClick={() => toggleSection("MONTHLY")}
                    className="w-full flex items-center justify-between px-5"
                >
                    <span
                        style={{
                            ...labelStyle,
                            fontWeight:
                                selectedFrequency === "MONTHLY"
                                    ? "var(--weight-semibold)"
                                    : "var(--weight-regular)",
                        }}
                    >
                        매월
                    </span>
                    <Icon
                        icon={
                            open === "MONTHLY"
                                ? "mdi:chevron-up"
                                : "mdi:chevron-down"
                        }
                        width={20}
                        height={20}
                        className="text-[var(--color-dark-gray)]"
                    />
                </button>

                {open === "MONTHLY" && (
                    <div className="mt-3 px-5">
                        <div className="flex flex-wrap gap-[9px]">
                            {MONTH_DAYS.map((d) => (
                                <ToggleChip
                                    key={d}
                                    label={String(d)}
                                    selected={monthlyDays.includes(d)}
                                    onClick={() =>
                                        toggleInArray(
                                            monthlyDays,
                                            d,
                                            setMonthlyDays
                                        )
                                    }
                                />
                            ))}
                        </div>

                        <div className="mt-2">
                            <ToggleChip
                                label="매월 마지막 일"
                                selected={monthlyLast}
                                fullWidth
                                onClick={() => setMonthlyLast((v) => !v)}
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* 매년 */}
            <section className="border-b border-[var(--color-super-light-gray)] py-4.5 -mx-5">
                <button
                    type="button"
                    onClick={() => toggleSection("YEARLY")}
                    className="w-full flex items-center justify-between px-5"
                >
                    <span
                        style={{
                            ...labelStyle,
                            fontWeight:
                                selectedFrequency === "YEARLY"
                                    ? "var(--weight-semibold)"
                                    : "var(--weight-regular)",
                        }}
                    >
                        매년
                    </span>
                    <Icon
                        icon={
                            open === "YEARLY"
                                ? "mdi:chevron-up"
                                : "mdi:chevron-down"
                        }
                        width={20}
                        height={20}
                        className="text-[var(--color-dark-gray)]"
                    />
                </button>

                {open === "YEARLY" && (
                    <div className="mt-3 flex flex-col gap-4">
                        {/* 월별 */}
                        <div className="px-5">
                            <div
                                className="mb-2"
                                style={{
                                    fontSize: "var(--text-caption)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                월별
                            </div>
                            <div className="flex flex-wrap gap-[9px]">
                                {MONTHS.map((m) => (
                                    <ToggleChip
                                        key={m}
                                        label={String(m)}
                                        selected={yearMonths.includes(m)}
                                        onClick={() =>
                                            toggleInArray(
                                                yearMonths,
                                                m,
                                                setYearMonths
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 일자 */}
                        <div className="px-5">
                            <div
                                className="mb-2"
                                style={{
                                    fontSize: "var(--text-caption)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                일자
                            </div>
                            <div className="flex flex-wrap gap-[9px]">
                                {MONTH_DAYS.map((d) => (
                                    <ToggleChip
                                        key={d}
                                        label={String(d)}
                                        selected={yearDays.includes(d)}
                                        onClick={() =>
                                            toggleInArray(
                                                yearDays,
                                                d,
                                                setYearDays
                                            )
                                        }
                                    />
                                ))}
                            </div>
                            <div className="mt-2">
                                <ToggleChip
                                    label="매월 마지막 일"
                                    selected={yearLast}
                                    fullWidth
                                    onClick={() => setYearLast((v) => !v)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* 하단 완료 버튼 */}
            <div className="mt-10 mb-4">
                <OpuActionButton label="완료" onClick={handleDone} />
            </div>
        </div>
    );
}
