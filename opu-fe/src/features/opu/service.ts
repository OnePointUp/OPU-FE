import {
    OpuListFilterRequest,
    OpuListPage,
    OpuSummaryResponse,
} from "./domain";
import { toOpuCardModelFromSummary } from "./mappers";
import { apiClient } from "@/lib/apiClient";
import { ApiResponse, PageResponse } from "@/types/api";
import { extractErrorMessage } from "@/utils/api-helpers";

type FetchOpuListParams = {
    page?: number;
    size?: number;
    filter?: OpuListFilterRequest;
};

// 공유 OPU 목록 조회
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

// 내가 만든 OPU 목록
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
