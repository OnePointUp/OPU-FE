import { OpuCardModel } from "@/features/opu/domain";
import { BlockedOpuSummaryResponse } from "./types";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse, PageResponse } from "@/types/api";
import { toBlockedOpuCard } from "./mapper";
import { extractErrorMessage } from "@/utils/api-helpers";

// 차단 OPU 목록 조회
export async function getBlockedOpuList(): Promise<OpuCardModel[]> {
    try {
        const res = await apiClient.get<
            ApiResponse<PageResponse<BlockedOpuSummaryResponse>>
        >("/opus/blocked", {
            params: { page: 0, size: 20 },
        });

        const page = res.data.data;
        return page.content.map(toBlockedOpuCard);
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "차단한 OPU 목록을 불러오지 못했어요.")
        );
    }
}

// 단일 차단 해제
export async function deleteBlockedOpu(opuId: number): Promise<void> {
    try {
        await apiClient.delete(`/opus/${opuId}/block`);
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU 차단 해제에 실패했어요.")
        );
    }
}

// 다중 차단 해제
export async function deleteBlockedOpuBulk(opuIds: number[]): Promise<void> {
    try {
        await apiClient.delete("/opus/blocks", {
            data: { opuIds },
        });
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU 차단 해제에 실패했어요.")
        );
    }
}
