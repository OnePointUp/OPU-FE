import type { OpuCardModel } from "../domain";
import { CATEGORY_MAP } from "../domain";
import { type TimeCode, mapTimeToLabel } from "./time";

export type OpuFilterState = {
    q: string;
    times: TimeCode[];
    categoryIds: number[];
};

export function filterOpuList(
    items: OpuCardModel[],
    { q, times, categoryIds }: OpuFilterState
): OpuCardModel[] {
    const text = q.trim().toLowerCase();
    const hasTimeFilter = times.length > 0;

    return items.filter((item) => {
        // 검색어
        if (text && !item.title.toLowerCase().includes(text)) return false;

        // 기간 필터
        if (hasTimeFilter) {
            const matched = times.some(
                (p) => mapTimeToLabel(p) === item.timeLabel
            );
            if (!matched) return false;
        }

        // 카테고리 필터
        if (categoryIds.length > 0 && !categoryIds.includes(item.categoryId)) {
            return false;
        }

        return true;
    });
}

export function getTimeFilterLabel(times: TimeCode[]): string {
    if (times.length === 0) return "시간";
    const labels = times.map((p) => mapTimeToLabel(p));
    if (labels.length <= 2) return labels.join(", ");
    return `${labels[0]} 외 ${labels.length - 1}개`;
}

export function getCategoryFilterLabel(categoryIds: number[]): string {
    if (categoryIds.length === 0) return "카테고리";

    const names = categoryIds
        .map((id) => CATEGORY_MAP[id])
        .filter((v): v is string => Boolean(v));

    if (names.length <= 2) return names.join(", ");
    return `${names[0]} 외 ${names.length - 1}개`;
}
