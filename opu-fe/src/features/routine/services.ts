import type { RoutineEntity } from "./domain";
import { requestJSON } from "@/lib/request";
import { CreateRoutinePayload, UpdateRoutinePayload } from "./types";

type RoutineListResponse = {
    items: RoutineEntity[];
};

const BASE = "/routine";

// 루틴 목록 조회
export function fetchRoutineList(): Promise<RoutineEntity[]> {
    return requestJSON<RoutineListResponse>(BASE).then((data) => data.items);
}

// 개별 루틴 조회
export function fetchRoutine(id: number): Promise<RoutineEntity> {
    return requestJSON<RoutineEntity>(`${BASE}/${id}`);
}

// 루틴 등록
export function createRoutine(payload: CreateRoutinePayload) {
    return requestJSON<RoutineEntity>(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

// 루틴 수정
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
