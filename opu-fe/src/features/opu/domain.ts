export type OpuEntity = {
    id: number;
    category_id: number;
    created_by: number;
    title: string;
    description: string;
    created_at: string;
    required_time: "1M" | "5M" | "30M" | "1H" | "DAILY";
    is_shared: "Y" | "N";
    emoji: string;
};
export type LikeEntity = {
    id: number;
    member_id: number;
    opu_id: number;
    created_at: string;
};
export type OpuCardModel = {
    id: number;
    title: string;
    categoryId: number;
    categoryName?: string;
    periodLabel: string;
    completedCount?: number;
    locked?: boolean;
    liked: boolean;
    shareLabel?: string;
    createdAt?: string;
    emoji?: string;
};

const CATEGORY_MAP: Record<number, string> = {
    1: "🌱 자기계발",
    2: "🧘 마음건강",
    3: "👥 관계&소통",
    4: "💡 창의활동",
    5: "🏋️ 신체활동",
    6: "🍽️ 식습관",
    7: "🎨 문화생활",
    8: "📚 지식확장",
    9: "💰 경제습관",
    10: "🏡 생활습관",
    11: "🛌 휴식&재충전",
    12: "💞 자기이해",
    13: "🎯 도전&성취",
};

export type CategoryBadgeStyle = { bg: string; text: string };
export const CATEGORY_BADGE: Record<string, CategoryBadgeStyle> = {
    "🌱 자기계발": { bg: "#FFE2D0", text: "#FF7018" },
    "🧘 마음건강": { bg: "#FFE4EC", text: "#E34E77" },
    "👥 관계&소통": { bg: "#EAF2FF", text: "#2A66CC" },
    "💡 창의활동": { bg: "#F2EFFF", text: "#6C53D7" },
    "🏋️ 신체활동": { bg: "#E6F4EA", text: "#2E7D32" },
    "🍽️ 식습관": { bg: "#E8F6D4", text: "#5C9B00" },
    "🎨 문화생활": { bg: "#FFF6E5", text: "#E37D00" },
    "📚 지식확장": { bg: "#EDF0FF", text: "#4953C4" },
    "💰 경제습관": { bg: "#FFF1E6", text: "#D96B00" },
    "🏡 생활습관": { bg: "#D9E0FF", text: "#4366FF" },
    "🛌 휴식&재충전": { bg: "#F3E8FF", text: "#7E3AF2" },
    "💞 자기이해": { bg: "#FFE8F0", text: "#D72672" },
    "🎯 도전&성취": { bg: "#E8F7FF", text: "#0086C9" },
    기타: { bg: "#E3E3E3", text: "#6F6F6F" },
};

export const toCategoryName = (id: number) => CATEGORY_MAP[id] ?? "기타";

const PERIOD_LABEL_MAP: Record<OpuEntity["required_time"], string> = {
    "1M": "1분",
    "5M": "5분",
    "30M": "30분",
    "1H": "1시간",
    DAILY: "1일",
};

export function toPeriodLabelFromCode(rt: OpuEntity["required_time"]) {
    return PERIOD_LABEL_MAP[rt] ?? "기타";
}
