import type { RoutineEntity } from "./domain";
import type {
    CreateRoutinePayload,
    RoutineFormValue,
    UpdateRoutinePayload,
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

export function toUpdateRoutinePayload(
    form: RoutineFormValue
): UpdateRoutinePayload {
    if (!form.id) {
        throw new Error("Routine id is required for update");
    }
    return {
        id: form.id,
        title: form.title,
        frequency: form.frequency,
        startDate: form.startDate ?? undefined,
        endDate: form.endDate,
        alarmTime: form.alarmTime ?? undefined,
        color: form.color,
        weekDays: form.weekDays ?? undefined,
        monthDays: form.monthDays ?? undefined,
        yearDays: form.yearDays ?? undefined,
    };
}
