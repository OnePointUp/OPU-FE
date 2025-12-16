import type { OpuSortOption, SortOption } from "./types";

export const SORT_OPTION_TO_API_SORT: Record<SortOption, OpuSortOption> = {
    liked: "FAVORITE", // 좋아요 많은 순
    completed: "COMPLETION", // 완료 많은 순
    name: "NAME_ASC", // 이름 오름차순
    latest: "NEWEST", // 최신순
};

export const SORT_LABEL_MAP: Record<SortOption, string> = {
    name: "이름순",
    latest: "최신순",
    completed: "완료순",
    liked: "인기순",
};

export function getSortLabel(option: SortOption): string {
    return SORT_LABEL_MAP[option] ?? "정렬";
}
