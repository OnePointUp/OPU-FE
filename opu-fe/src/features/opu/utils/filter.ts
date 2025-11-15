import type { OpuCardModel } from "../domain";
import { CATEGORY_MAP } from "../domain";
import { type PeriodCode, mapPeriodToLabel } from "./period";

export type OpuFilterState = {
    q: string;
    periods: PeriodCode[];
    categoryIds: number[];
};

export function filterOpuList(
    items: OpuCardModel[],
    { q, periods, categoryIds }: OpuFilterState
): OpuCardModel[] {
    const text = q.trim().toLowerCase();
    const hasPeriodFilter = periods.length > 0;

    return items.filter((item) => {
        // 검색어
        if (text && !item.title.toLowerCase().includes(text)) return false;

        // 기간 필터
        if (hasPeriodFilter) {
            const matched = periods.some(
                (p) => mapPeriodToLabel(p) === item.periodLabel
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

export function getPeriodFilterLabel(periods: PeriodCode[]): string {
    if (periods.length === 0) return "시간";
    const labels = periods.map((p) => mapPeriodToLabel(p));
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
