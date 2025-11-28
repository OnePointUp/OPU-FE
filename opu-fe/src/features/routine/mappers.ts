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
        time: e.time,
        color: e.color,
    };
}

export function toCreateRoutinePayload(
    form: RoutineFormValue
): CreateRoutinePayload {
    return {
        title: form.title,
        frequency: form.frequency,
        startDate: form.startDate ?? new Date().toISOString().slice(0, 10),
        endDate: form.endDate,
        time: form.time,
        color: form.color,
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
        time: form.time,
        color: form.color,
    };
}
