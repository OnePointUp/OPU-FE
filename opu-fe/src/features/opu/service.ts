import {
    buildOpuTodoPayload,
    FetchOpuListParams,
    FetchRandomOpuParams,
    mapTimeToRequiredMinutes,
    OpuListPage,
    OpuSummaryResponse,
    RandomOpuResponse,
    RandomScope,
    RegisterOpuPayload,
    TimeCode,
} from "./domain";
import { toOpuCardModelFromRandom, toOpuCardModelFromSummary } from "./mappers";
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
        throw new Error(extractErrorMessage(err, "OPU를 찜 하지 못했어요."));
    }
}

/* ==== 찜 해제 ===== */
export async function unlikeOpu(opuId: number) {
    try {
        await apiClient.delete(`/opus/${opuId}/favorite`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU를 찜 해제하지 못했어요.")
        );
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
            extractErrorMessage(err, "투두리스트 추가에 실패했어요.")
        );
    }
}

/* ==== OPU 등록 ===== */
export async function registerOpu(payload: RegisterOpuPayload) {
    try {
        await apiClient.post("/opus", payload);
        return { ok: true };
    } catch (err) {
        throw new Error(extractErrorMessage(err, "OPU 등록에 실패했어요."));
    }
}

/* ==== 공개 설정 ===== */
export async function shareOpu(opuId: number) {
    try {
        await apiClient.patch(`/opus/${opuId}/share`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU 공개 처리에 실패했어요.")
        );
    }
}

/* ==== 비공개 설정 ===== */
export async function unshareOpu(opuId: number) {
    try {
        await apiClient.patch(`/opus/${opuId}/unshare`);

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "OPU 비공개 처리에 실패했어요.")
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

/* ==== OPU 삭제 ===== */
export async function deleteMyOpu(opuId: number): Promise<void> {
    try {
        await apiClient.delete(`/opus/${opuId}`);
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "OPU 삭제에 실패했어요."));
    }
}

// ==== OPU 랜덤 뽑기 (raw) =====
export async function fetchRandomOpu(
    params: FetchRandomOpuParams
): Promise<RandomOpuResponse | null> {
    try {
        const res = await apiClient.get<ApiResponse<RandomOpuResponse>>(
            "/opus/random",
            {
                params: {
                    source: params.source,
                    requiredMinutes: params.requiredMinutes,
                    excludeOpuId: params.excludeOpuId,
                },
            }
        );

        return res.data.data ?? null;
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "랜덤 OPU를 불러오지 못했어요.")
        );
    }
}

// ==== OPU 랜덤 뽑기 (화면용 카드 모델) =====
export async function drawRandomOpu(
    scope: RandomScope,
    time: TimeCode,
    excludeOpuId?: number
) {
    const params: FetchRandomOpuParams = {
        source: scope,
        requiredMinutes: mapTimeToRequiredMinutes(time),
        excludeOpuId,
    };

    const data = await fetchRandomOpu(params);
    if (!data) return null;

    return toOpuCardModelFromRandom(data);
}

/* ==== 랜덤 뽑기 시간 요약 조회 ===== */

type TimeSummaryPayload = {
    requiredMinutes: Record<string, number>;
};

const KOREAN_TIME_KEY_TO_CODE: Record<string, TimeCode> = {
    전체: "ALL",
    "1분": "1M",
    "5분": "5M",
    "30분": "30M",
    "1시간": "1H",
    "1일": "DAILY",
};

export async function fetchRandomTimeSummary(
    scope: RandomScope
): Promise<Record<TimeCode, number>> {
    try {
        const path =
            scope === "FAVORITE"
                ? "/opus/time-summary/favorite"
                : "/opus/time-summary/all";

        const res = await apiClient.get<ApiResponse<TimeSummaryPayload>>(path);

        const raw = res.data.data.requiredMinutes;

        const result: Record<TimeCode, number> = {
            ALL: 0,
            "1M": 0,
            "5M": 0,
            "30M": 0,
            "1H": 0,
            DAILY: 0,
        };

        Object.entries(raw).forEach(([label, count]) => {
            const code = KOREAN_TIME_KEY_TO_CODE[label];
            if (code) {
                result[code] = count;
            }
        });

        return result;
    } catch (err) {
        throw new Error(
            extractErrorMessage(err, "시간별 OPU 개수 조회에 실패했어요.")
        );
    }
}
