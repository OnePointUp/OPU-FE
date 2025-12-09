import {
    CreateRoutinePayload,
    DeleteScope,
    EditRoutinePayload,
    RoutineDetailResponse,
    RoutineFormValue,
    RoutineListItemResponse,
} from "./types";
import { extractErrorMessage } from "@/utils/api-helpers";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse, PageResponse } from "@/types/api";

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
export async function fetchRoutineDetail(
    routineId: number
): Promise<RoutineFormValue> {
    try {
        const res = await apiClient.get<ApiResponse<RoutineDetailResponse>>(
            `/routines/${routineId}`
        );

        const r = res.data.data;

        const form: RoutineFormValue = {
            id: r.id,
            title: r.title,
            color: r.color,
            frequency: r.frequency,
            startDate: r.startDate,
            endDate: r.endDate,
            alarmTime: r.alarmTime,
            weekDays: r.weekDays ?? null,
            monthDays: r.monthDays ?? null,
            yearDays: r.days ?? null,
        };

        return form;
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "루틴 상세 정보를 불러오지 못했어요.")
        );
    }
}

/* ==== 루틴 등록 ===== */
export async function createRoutine(
    payload: CreateRoutinePayload
): Promise<RoutineDetailResponse> {
    const res = await apiClient.post<ApiResponse<RoutineDetailResponse>>(
        "/routines",
        payload
    );

    return res.data.data;
}

/* ===== 루틴 수정 ===== */
export async function editRoutine(
    routineId: number,
    payload: EditRoutinePayload
) {
    try {
        await apiClient.patch(`/routines/${routineId}`, payload);
        return { ok: true };
    } catch (err) {
        throw new Error(extractErrorMessage(err, "루틴 수정에 실패했어요."));
    }
}

/* ===== 루틴 삭제 ===== */
export async function deleteRoutine(
    routineId: number,
    scope: DeleteScope = "ALL"
) {
    try {
        await apiClient.delete(`/routines/${routineId}`, {
            params: { scope },
        });
        return { ok: true };
    } catch (err) {
        throw new Error(extractErrorMessage(err, "루틴 삭제에 실패했어요."));
    }
}
