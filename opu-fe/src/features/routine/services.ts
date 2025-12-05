import type { RoutineEntity } from "./domain";
import { requestJSON } from "@/lib/request";
import {
    CreateRoutinePayload,
    RoutineFormValue,
    RoutineListItemResponse,
    UpdateRoutinePayload,
} from "./types";
import { extractErrorMessage } from "@/utils/api-helpers";
import { apiClient } from "@/lib/apiClient";
import { PageResponse } from "@/types/api";

/* ==== 루틴 목록 조회 ===== */
export async function fetchRoutineList(
    page = 0,
    size = 10
): Promise<PageResponse<RoutineListItemResponse>> {
    try {
        const res = await apiClient.get<PageResponse<RoutineListItemResponse>>(
            "/routines",
            { params: { page, size } }
        );
        return res.data;
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "루틴 목록을 불러오지 못했어요.")
        );
    }
}

/* ==== 루틴 상세 조회 ===== */
export async function fetchRoutineDetail(routineId: number) {
    try {
        const res = await apiClient.get<RoutineFormValue>(
            `/routines/${routineId}`
        );
        return res.data;
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "루틴 목록을 불러오지 못했어요.")
        );
    }
}

// ============================

const BASE = "/routine";

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
