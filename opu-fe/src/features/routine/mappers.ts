import type { RoutineEntity } from "./domain";
import type {
    CreateRoutinePayload,
    EditRoutinePayload,
    RoutineFormValue,
} from "./types";

export function toRoutineFormValue(e: RoutineEntity): RoutineFormValue {
    return {
        id: e.id,
        title: e.title,
        frequency: e.frequency,
        startDate: e.startDate,
        endDate: e.endDate,
        alarmTime: e.alarmTime,
        color: e.color,
        weekDays: e.weekDays,
        monthDays: e.monthDays,
        yearDays: e.yearDays,
    };
}

export function toCreateRoutinePayload(
    form: RoutineFormValue
): CreateRoutinePayload {
    if (!form.startDate) {
        throw new Error("startDate는 필수입니다.");
    }

    const payload: CreateRoutinePayload = {
        title: form.title,
        color: form.color,
        frequency: form.frequency,
        startDate: form.startDate,
        endDate: form.endDate ?? null,
        alarmTime: form.alarmTime ?? null,
    };

    if (form.frequency === "WEEKLY" || form.frequency === "BIWEEKLY") {
        payload.weekDays = form.weekDays ?? null;
    }

    if (form.frequency === "MONTHLY") {
        payload.monthDays = form.monthDays ?? null;
    }

    if (form.frequency === "YEARLY") {
        payload.yearDays = form.yearDays ?? null;
    }

    return payload;
}

export function toEditRoutinePayload(
    form: RoutineFormValue,
    scope: string
): EditRoutinePayload {
    const base: EditRoutinePayload = {
        title: form.title,
        color: form.color,
        alarmTime: form.alarmTime ?? null,
        endDate: form.endDate ?? null,
        frequency: form.frequency,
        scope,
    };

    if (form.frequency === "WEEKLY" || form.frequency === "BIWEEKLY") {
        return {
            ...base,
            weekDays: form.weekDays ?? null,
        };
    }

    if (form.frequency === "MONTHLY") {
        return {
            ...base,
            monthDays: form.monthDays ?? null,
        };
    }

    if (form.frequency === "YEARLY") {
        return {
            ...base,
            days: form.yearDays ?? null,
        };
    }

    return base;
}
