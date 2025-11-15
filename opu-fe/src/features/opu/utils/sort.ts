import type { OpuCardModel } from "../domain";

export type SortOption = "name" | "latest" | "completed" | "liked";

export const SORT_LABEL_MAP: Record<SortOption, string> = {
    name: "이름순",
    latest: "최신순",
    completed: "완료순",
    liked: "찜 많은 순",
};

export function getSortLabel(option: SortOption): string {
    return SORT_LABEL_MAP[option] ?? "정렬";
}

export function sortOpuList(items: OpuCardModel[], option: SortOption) {
    const sorted = [...items];

    switch (option) {
        case "name":
            return sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
        case "latest":
            return sorted.sort((a, b) =>
                (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
            );
        case "completed":
            return sorted.sort(
                (a, b) => (b.completedCount ?? 0) - (a.completedCount ?? 0)
            );
        case "liked":
            return sorted.sort(
                (a, b) => (b.likedCount ?? 0) - (a.likedCount ?? 0)
            );
        default:
            return items;
    }
}
