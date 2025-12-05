import { formatDate } from "@/utils/formatDate";
import { RoutineFormValue, RoutineListItemResponse } from "./types";

export type toRoutineListCard = {
    id: number;
    title: string;
    startDate: string;
    endDate: string | null;
    frequencyLabel: string;
};

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
    alarmTime: string | null;
    color: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    weekDays?: string | null;
    monthDays?: string | null;
    yearDays?: string | null;
}

export function getRoutineStatus(
    routine: RoutineListItemResponse,
    today: Date = new Date()
): RoutineDerivedStatus {
    if (!routine.active) return "ENDED";

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
            return "매월";
        case "YEARLY":
            return "매년";
    }
}

const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export function parseNumberList(raw: string | null | undefined): number[] {
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
        const parts: string[] = [];

        if (days.length) {
            parts.push(...days.map((d) => `${d}일`));
        }
        if (last) {
            parts.push("마지막 일");
        }

        if (!parts.length) return base;
        return `${base} ${parts.join(", ")}`;
    }

    if (frequency === "YEARLY") {
        const pieces: string[] = [];

        if (months.length) {
            pieces.push(months.map((m) => `${m}월`).join(", "));
        }

        if (last) {
            pieces.push("마지막 일");
        } else if (days.length) {
            pieces.push(days.map((d) => `${d}일`).join(", "));
        }

        if (!pieces.length) return base;
        return `${base} ${pieces.join(" ")}`;
    }

    return base;
}

export function formatDateRange(startDate: string, endDate: string | null) {
    if (!endDate) return formatDate(startDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getFrequencyPartsFromRoutine(routine: RoutineFormValue): {
    days: number[];
    months: number[];
    last: boolean;
} {
    let days: number[] = [];
    let months: number[] = [];
    let last = false;

    if (routine.frequency === "WEEKLY" || routine.frequency === "BIWEEKLY") {
        if (routine.weekDays) {
            days = routine.weekDays
                .split(",")
                .map((s) => s.trim())
                .map((s) => Number(s))
                .filter((n) => !Number.isNaN(n))
                .map((n) => n + 1);
        }
    } else if (routine.frequency === "MONTHLY") {
        if (routine.monthDays) {
            const tokens = routine.monthDays.split(",").map((s) => s.trim());
            const numDays: number[] = [];
            for (const t of tokens) {
                if (t === "L") {
                    last = true;
                    continue;
                }
                const num = Number(t);
                if (!Number.isNaN(num)) numDays.push(num);
            }
            days = numDays;
        }
    } else if (routine.frequency === "YEARLY") {
        if (routine.yearDays) {
            const tokens = routine.yearDays.split(",").map((s) => s.trim());
            const mList: number[] = [];
            const dList: number[] = [];
            for (const t of tokens) {
                const [mStr, dStr] = t.split("-");
                const m = Number(mStr);
                const d = Number(dStr);
                if (!Number.isNaN(m) && !Number.isNaN(d)) {
                    mList.push(m);
                    dList.push(d);
                }
            }
            months = mList;
            days = dList;
        }
    }

    return { days, months, last };
}
