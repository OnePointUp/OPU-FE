import { formatDate } from "@/utils/formatDate";

export type RoutineFrequency =
    | "DAILY"
    | "WEEKLY"
    | "BIWEEKLY"
    | "MONTHLY"
    | "YEARLY";

export type RoutineDerivedStatus = "ONGOING" | "NOT_STARTED" | "ENDED";

export interface RoutineEntity {
    id: number;
    memberId: number;
    title: string;
    frequency: RoutineFrequency;
    startDate: string;
    endDate: string | null;
    time: string | null;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export function getRoutineStatus(
    routine: RoutineEntity,
    today: Date = new Date()
): RoutineDerivedStatus {
    if (!routine.isActive) return "ENDED";

    const start = new Date(routine.startDate);
    const end = routine.endDate ? new Date(routine.endDate) : null;

    if (today < start) return "NOT_STARTED";
    if (end && today > end) return "ENDED";
    return "ONGOING";
}

export function getStatusLabel(status: RoutineDerivedStatus): string {
    switch (status) {
        case "ONGOING":
            return "진행 중";
        case "NOT_STARTED":
            return "시작 전";
        case "ENDED":
            return "종료";
    }
}

export function getStatusColor(status: RoutineDerivedStatus): string {
    switch (status) {
        case "ONGOING":
            return "#2481FF";
        case "NOT_STARTED":
            return "#FF4A4A";
        case "ENDED":
            return "#B0B0B0";
    }
}

export function getFrequencyLabel(frequency: RoutineFrequency): string {
    switch (frequency) {
        case "DAILY":
            return "매일";
        case "WEEKLY":
            return "매주";
        case "BIWEEKLY":
            return "격주";
        case "MONTHLY":
            return "매달";
        case "YEARLY":
            return "매년";
    }
}

const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export function parseNumberList(raw: string | null): number[] {
    if (!raw) return [];
    return raw
        .split(",")
        .map((v) => Number(v))
        .filter((v) => !Number.isNaN(v));
}

export function buildFrequencyLabel(
    frequency: RoutineFrequency,
    days: number[],
    months: number[],
    last: boolean
): string {
    const base = getFrequencyLabel(frequency);

    if (frequency === "WEEKLY" || frequency === "BIWEEKLY") {
        if (!days.length) return base;
        const names = days
            .filter((d) => d >= 1 && d <= 7)
            .map((d) => WEEK_LABELS[d - 1]);
        return `${base} ${names.join(", ")}`;
    }

    if (frequency === "MONTHLY") {
        if (last) return `${base} 매월 마지막 날`;
        if (!days.length) return base;
        const labels = days.map((d) => `${d}일`);
        return `${base} ${labels.join(", ")}`;
    }

    if (frequency === "YEARLY") {
        if (!months.length && !days.length && !last) return base;

        const monthLabel = months.length
            ? months.map((m) => `${m}월`).join(", ")
            : "";

        const dayLabel = last
            ? "마지막 날"
            : days.length
            ? days.map((d) => `${d}일`).join(", ")
            : "";

        const combined = [monthLabel, dayLabel].filter(Boolean).join(" ");
        return `${base} ${combined}`;
    }

    return base;
}

export function formatDateRange(startDate: string, endDate: string | null) {
    if (!endDate) return formatDate(startDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
