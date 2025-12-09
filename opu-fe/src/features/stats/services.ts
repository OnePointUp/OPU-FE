import { apiClient } from "@/lib/apiClient";
import { extractErrorMessage } from "@/utils/api-helpers";
import type { ApiResponse } from "@/types/api";
import { FetchMonthlyStatsParams, OpuMonthlyStatsResponse } from "./types";

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
