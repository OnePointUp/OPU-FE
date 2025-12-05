"use client";

import {
    formatDateRange,
    getFrequencyLabel,
    getRoutineStatus,
    getStatusColor,
    getStatusLabel,
} from "../domain";
import { RoutineListItemResponse } from "../types";

type Props = {
    item: RoutineListItemResponse;
    onClick?: (id: number) => void;
};

export default function RoutineListItem({ item, onClick }: Props) {
    const status = getRoutineStatus(item);
    const statusLabel = getStatusLabel(status);
    const statusColor = getStatusColor(status);
    const dateRange = formatDateRange(item.startDate, item.endDate);
    const freqLabel = getFrequencyLabel(item.frequency);

    return (
        <button
            type="button"
            className="w-full py-3 text-left border-b border-[var(--color-super-light-gray)] active:bg-gray-50"
            onClick={() => onClick?.(item.id)}
        >
            <div className="flex items-center gap-2 mb-0.5">
                {/* 진행상태(시작전, 진행중, 종료) */}
                <span
                    style={{
                        color: statusColor,
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-medium)",
                    }}
                >
                    {statusLabel}
                </span>

                <span className="text-[11px] text-[var(--color-light-gray)]">
                    |
                </span>
                <span
                    style={{
                        color: "var(--color-dark-navy)",
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-regular)",
                    }}
                >
                    {item.title}
                </span>
            </div>

            <p
                style={{
                    color: "var(--color-light-gray)",
                    fontSize: "var(--text-mini)",
                    fontWeight: "var(--weight-regular)",
                }}
            >
                {dateRange} / {freqLabel}
            </p>
        </button>
    );
}
