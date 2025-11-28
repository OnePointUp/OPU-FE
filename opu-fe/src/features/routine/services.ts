import type { RoutineEntity } from "./domain";
import { requestJSON } from "@/lib/request";
import { CreateRoutinePayload, UpdateRoutinePayload } from "./types";

type RoutineListResponse = {
    items: RoutineEntity[];
};

const BASE = "/routine";

export function fetchRoutineList(): Promise<RoutineEntity[]> {
    return requestJSON<RoutineListResponse>(BASE).then((data) => data.items);
}

export function createRoutine(payload: CreateRoutinePayload) {
    return requestJSON<RoutineEntity>(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export function updateRoutine(payload: UpdateRoutinePayload) {
    return requestJSON<RoutineEntity>(BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export function deleteRoutine(id: number) {
    return requestJSON<{ ok: boolean }>(BASE, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
}
