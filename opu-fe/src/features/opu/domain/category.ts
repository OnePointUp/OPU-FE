import type { CategoryBadgeStyle, CategoryMap } from "./types";

// 기본 팔레트: API에서 내려주는 카테고리 ID 순서대로 로테이션
export const CATEGORY_BADGE_PALETTE: CategoryBadgeStyle[] = [
    { bg: "#FFE2D0", text: "#FF7018" },
    { bg: "#FFE4EC", text: "#E34E77" },
    { bg: "#EAF2FF", text: "#2A66CC" },
    { bg: "#F2EFFF", text: "#6C53D7" },
    { bg: "#E6F4EA", text: "#2E7D32" },
    { bg: "#E8F6D4", text: "#5C9B00" },
    { bg: "#FFF6E5", text: "#E37D00" },
    { bg: "#EDF0FF", text: "#4953C4" },
    { bg: "#FFF1E6", text: "#D96B00" },
    { bg: "#D9E0FF", text: "#4366FF" },
    { bg: "#F3E8FF", text: "#7E3AF2" },
    { bg: "#FFE8F0", text: "#D72672" },
    { bg: "#E8F7FF", text: "#0086C9" },
];

export const CATEGORY_BADGE_LEGACY: Record<string, CategoryBadgeStyle> = {
    자기계발: CATEGORY_BADGE_PALETTE[0],
    마음건강: CATEGORY_BADGE_PALETTE[1],
    "관계&소통": CATEGORY_BADGE_PALETTE[2],
    창의활동: CATEGORY_BADGE_PALETTE[3],
    신체활동: CATEGORY_BADGE_PALETTE[4],
    식습관: CATEGORY_BADGE_PALETTE[5],
    문화생활: CATEGORY_BADGE_PALETTE[6],
    지식확장: CATEGORY_BADGE_PALETTE[7],
    경제습관: CATEGORY_BADGE_PALETTE[8],
    생활습관: CATEGORY_BADGE_PALETTE[9],
    "휴식&재충전": CATEGORY_BADGE_PALETTE[10],
    자기이해: CATEGORY_BADGE_PALETTE[11],
    "도전&성취": CATEGORY_BADGE_PALETTE[12],
};

// 유지보수를 위해 남겨둔 호환용 매핑(기존 코드 대비)
export const CATEGORY_BADGE: Record<string, CategoryBadgeStyle> = {
    ...CATEGORY_BADGE_LEGACY,
    기타: { bg: "#E3E3E3", text: "#6F6F6F" },
};

export const toCategoryName = (
    id: number,
    categoryMap?: CategoryMap
): string => categoryMap?.[id] ?? "기타";

export const getCategoryBadge = (
    categoryId?: number,
    categoryName?: string
): CategoryBadgeStyle => {
    if (categoryName && CATEGORY_BADGE_LEGACY[categoryName]) {
        return CATEGORY_BADGE_LEGACY[categoryName];
    }

    if (categoryId != null && CATEGORY_BADGE_PALETTE.length > 0) {
        const index =
            ((categoryId - 1) % CATEGORY_BADGE_PALETTE.length +
                CATEGORY_BADGE_PALETTE.length) %
            CATEGORY_BADGE_PALETTE.length;
        return CATEGORY_BADGE_PALETTE[index];
    }

    return { bg: "#E3E3E3", text: "#6F6F6F" };
};

export function getCategoryFilterLabel(
    categoryIds: number[],
    categoryMap?: CategoryMap
): string {
    if (categoryIds.length === 0) return "카테고리";

    if (!categoryMap) return `${categoryIds.length}개 선택됨`;

    const names = categoryIds
        .map((id) => categoryMap[id])
        .filter((v): v is string => Boolean(v));

    if (names.length === 0) return `${categoryIds.length}개 선택됨`;
    if (names.length <= 2) return names.join(", ");
    return `${names[0]} 외 ${names.length - 1}개`;
}
