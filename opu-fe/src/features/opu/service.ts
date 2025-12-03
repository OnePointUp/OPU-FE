import {
    buildOpuTodoPayload,
    FetchOpuListParams,
    OpuListPage,
    OpuSummaryResponse,
    RegisterOpuPayload,
} from "./domain";
import { toOpuCardModelFromSummary } from "./mappers";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse, PageResponse } from "@/types/api";
import { extractErrorMessage } from "@/utils/api-helpers";

/* ==== 공유 OPU 목록 조회 ===== */
export async function fetchSharedOpuList({
    page = 0,
    size = 20,
    filter,
}: FetchOpuListParams = {}): Promise<OpuListPage> {
    try {
        const res = await apiClient.get<
            ApiResponse<PageResponse<OpuSummaryResponse>>
        >("/opus", {
            params: {
                ...filter,
                page,
                size,
            },
        });

        const pageData = res.data.data;

        return {
            ...pageData,
            content: pageData.content.map(toOpuCardModelFromSummary),
        };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "공유 OPU 목록을 불러오지 못했어요.")
        );
    }
}

/* ==== 내가 만든 OPU 목록 조회 ===== */
export async function fetchMyOpuList({
    page = 0,
    size = 20,
    filter,
}: FetchOpuListParams = {}): Promise<OpuListPage> {
    try {
        const res = await apiClient.get<
            ApiResponse<PageResponse<OpuSummaryResponse>>
        >("/opus/my", {
            params: {
                ...filter,
                page,
                size,
            },
        });

        const pageData = res.data.data;

        return {
            ...pageData,
            content: pageData.content.map(toOpuCardModelFromSummary),
        };
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "내 OPU 목록을 불러오지 못했어요.")
        );
    }
}

/* ==== 찜한 OPU 목록 조회 ===== */
export async function fetchLikedOpuList({
    page = 0,
    size = 20,
    filter,
}: FetchOpuListParams = {}): Promise<OpuListPage> {
    try {
        const res = await apiClient.get<
            ApiResponse<PageResponse<OpuSummaryResponse>>
        >("/opus/favorites", {
            params: {
                ...filter,
                page,
                size,
            },
        });

        const pageData = res.data.data;

        return {
            ...pageData,
            content: pageData.content.map(toOpuCardModelFromSummary),
        };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "찜한 OPU 목록을 불러오지 못했어요.")
        );
    }
}

/* ==== 찜 등록 ===== */
export async function likeOpu(opuId: number) {
    try {
        await apiClient.post(`/opus/${opuId}/favorite`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "OPU를 찜 하지 못했어요"));
    }
}

/* ==== 찜 해제 ===== */
export async function unlikeOpu(opuId: number) {
    try {
        await apiClient.delete(`/opus/${opuId}/favorite`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "OPU를 찜 해제하지 못했어요"));
    }
}

/* ==== 찜 토글 ===== */
export async function toggleOpuFavorite(
    opuId: number,
    isCurrentlyLiked: boolean
) {
    if (isCurrentlyLiked) {
        return unlikeOpu(opuId);
    }

    return likeOpu(opuId);
}

/* ==== 투두리스트에 OPU 추가 ===== */
export async function addTodoByOpu(opuId: number) {
    const payload = buildOpuTodoPayload();

    try {
        await apiClient.post(`/opu/${opuId}/todo`, payload);

        return { ok: true };
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "투두리스트 추가에 실패했어요")
        );
    }
}

/* ==== OPU 등록 ===== */
export async function registerOpu(payload: RegisterOpuPayload) {
    try {
        await apiClient.post("/opus", payload);
        return { ok: true };
    } catch (err) {
        throw new Error(extractErrorMessage(err, "OPU 등록에 실패했어요"));
    }
}

/* ==== 공개 설정 ===== */
export async function shareOpu(opuId: number) {
    try {
        await apiClient.patch(`/opus/${opuId}/share`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "OPU 공개 처리에 실패했어요"));
    }
}

/* ==== 비공개 설정 ===== */
export async function unshareOpu(opuId: number) {
    try {
        await apiClient.patch(`/opus/${opuId}/unshare`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU를 비공개 처리에 못했어요")
        );
    }
}

/* ==== 공유 설정 토글 ===== */
export async function toggleOpuShare(
    opuId: number,
    isCurrentlyShared: boolean
) {
    if (isCurrentlyShared) {
        return unshareOpu(opuId);
    }

    return shareOpu(opuId);
}
