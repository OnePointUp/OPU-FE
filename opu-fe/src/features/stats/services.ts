import { apiClient } from "@/lib/apiClient";
import { extractErrorMessage } from "@/utils/api-helpers";
import type { ApiResponse, PageResponse } from "@/types/api";
import {
    FetchMonthlyRoutineStatsParams,
    FetchMonthlyStatsParams,
    OpuCalendarResponse,
    OpuMonthlyStatsResponse,
    RoutineCalendarResponse,
    RoutineMonthlyStatsResponse,
    RoutineSummaryResponse,
} from "./types";

/* ==== 월별 OPU 통계 조회 ===== */
export async function fetchMonthlyOpuStats({
    year,
    month,
}: FetchMonthlyStatsParams): Promise<OpuMonthlyStatsResponse> {
    try {
        const res = await apiClient.get<ApiResponse<OpuMonthlyStatsResponse>>(
            "/opus/stats/monthly",
            {
                params: {
                    year,
                    month,
                },
            }
        );

        return res.data.data;
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU 월별 통계를 불러오지 못했어요.")
        );
    }
}

/* ==== OPU 캘린더 ===== */
type FetchOpuCalendarParams = {
    year: number;
    month: number;
};

export async function fetchOpuCalendar({
    year,
    month,
}: FetchOpuCalendarParams): Promise<OpuCalendarResponse> {
    try {
        const res = await apiClient.get<ApiResponse<OpuCalendarResponse>>(
            "/opus/calendar",
            {
                params: {
                    year,
                    month,
                },
            }
        );

        return res.data.data;
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU 캘린더 데이터를 불러오지 못했어요.")
        );
    }
}

/* ==== 루틴 목록 조회 (통계 전용) ===== */
export async function fetchRoutineListForStats(page = 0, size = 10) {
    try {
        const res = await apiClient.get<PageResponse<RoutineSummaryResponse>>(
            "/routines/summary",
            { params: { page, size } }
        );
        return res.data;
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "통계 - 루틴 목록을 불러오지 못했어요.")
        );
    }
}

/* ==== 루틴 캘린더 조회 ===== */
export async function fetchRoutineCalendar({
    routineId,
    year,
    month,
}: FetchMonthlyRoutineStatsParams): Promise<RoutineCalendarResponse> {
    try {
        const res = await apiClient.get<ApiResponse<RoutineCalendarResponse>>(
            `/routines/${routineId}/todos/stats`,
            {
                params: {
                    year,
                    month,
                },
            }
        );

        return res.data.data;
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "루틴 캘린더를 불러오지 못했어요.")
        );
    }
}

/* ==== 월별 루틴 통계 조회 ===== */
export async function fetchMonthlyRoutineStats({
    routineId,
    year,
    month,
}: FetchMonthlyRoutineStatsParams): Promise<RoutineMonthlyStatsResponse> {
    try {
        const res = await apiClient.get<
            ApiResponse<RoutineMonthlyStatsResponse>
        >(`/routines/${routineId}/stats/monthly`, {
            params: {
                year,
                month,
            },
        });

        return res.data.data;
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "월별 루틴 통계를 불러오지 못했어요.")
        );
    }
}

/* ==== 전체 루틴 월간 통계 ===== */
type FetchMonthlyRoutineStatsOverviewParams = {
    year: number;
    month: number;
    page?: number;
    size?: number;
};

export async function fetchMonthlyRoutineStatsOverview({
    year,
    month,
    page = 0,
    size = 10,
}: FetchMonthlyRoutineStatsOverviewParams): Promise<RoutineCalendarResponse[]> {
    try {
        const res = await apiClient.get<PageResponse<RoutineCalendarResponse>>(
            "/routines/todos/stats",
            {
                params: {
                    year,
                    month,
                    page,
                    size,
                },
            }
        );

        return res.data.content ?? [];
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(
                err,
                "루틴 월별 통계(전체)를 불러오지 못했어요."
            )
        );
    }
}
