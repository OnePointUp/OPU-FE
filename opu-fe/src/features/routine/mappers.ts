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
    return {
        title: form.title,
        color: form.color,
        frequency: form.frequency,
        startDate: form.startDate ?? new Date().toISOString().slice(0, 10),
        endDate: form.endDate,
        alarmTime: form.alarmTime ?? undefined,
        weekDays: form.weekDays ?? undefined,
        monthDays: form.monthDays ?? undefined,
        yearDays: form.yearDays ?? undefined,
    };
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
