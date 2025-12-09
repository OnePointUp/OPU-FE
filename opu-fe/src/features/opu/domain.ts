import { PageResponse } from "@/types/api";

/* ===========================
 * 정렬 옵션 (백엔드 ENUM과 1:1 매핑)
 * =========================== */

export type OpuSortOption = "NEWEST" | "NAME_ASC" | "COMPLETION" | "FAVORITE";

/* ===========================
 * API 응답 / 카드 모델
 * =========================== */

export type OpuSummaryResponse = {
    id: number;
    emoji: string;
    title: string;
    categoryId: number;
    categoryName: string;
    requiredMinutes: number;
    description: string;
    isShared: boolean;
    favorite: boolean;
    myCompletionCount: number;
    favoriteCount: number;
    creatorId: number;
    creatorNickname: string;
    isMine: boolean;
};

export type OpuCardModel = {
    id: number;
    title: string;
    description?: string;
    emoji?: string;
    categoryId?: number;
    categoryName?: string;

    timeLabel: string;

    completedCount?: number;
    isShared?: boolean;

    isLiked?: boolean;
    likeCount?: number;

    creatorId?: number;
    creatorNickname?: string;

    shareLabel?: string;
    createdAt?: string;
    isMine?: boolean;

    blockedAt?: string;
};

export type OpuListFilterRequest = {
    categoryIds?: number[];
    requiredMinutes?: number[];
    search?: string;
    favoriteOnly?: boolean;
    sort?: OpuSortOption;
};

export type OpuListPage = PageResponse<OpuCardModel>;

export type FetchOpuListParams = {
    page?: number;
    size?: number;
    filter?: OpuListFilterRequest;
};

export type OpuTodoCreateDto = {
    scheduledDate: string;
    scheduledTime: string | null;
};

export function buildOpuTodoPayload(): OpuTodoCreateDto {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return {
        scheduledDate: `${yyyy}-${mm}-${dd}`,
        scheduledTime: null,
    };
}

export type OpuFormValues = {
    title: string;
    description: string;
    emoji?: string;
    timeLabel?: string;
    categoryLabel?: string;
    isPublic: boolean;
};

export type RegisterOpuPayload = {
    title: string;
    description: string;
    emoji: string;
    requiredMinutes: number;
    isShared: boolean;
    categoryId: number;
};

/* ===========================
 * 랜덤 뽑기 관련 타입
 * =========================== */

export type RandomScope = "ALL" | "FAVORITE";

export type RandomOpuResponse = {
    id: number;
    emoji: string;
    title: string;
    categoryId: number;
    categoryName: string;
    requiredMinutes: number;
    description: string;
    isShared: boolean;
    favorite: boolean;
    myCompletionCount: number;
    favoriteCount: number;
    creatorId: number;
    creatorNickname: string;
    isMine: boolean;
};

export type FetchRandomOpuParams = {
    source: RandomScope;
    requiredMinutes?: number;
    excludeOpuId?: number;
};

/* ===========================
 * 목 데이터용 엔티티 타입 (프론트 전용)
 * =========================== */

export type OpuEntity = {
    id: number;
    member_id: number | null;
    category_id: number;
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

/* ===========================
 * 카테고리 맵 / 뱃지 스타일
 * =========================== */

export const CATEGORY_MAP: Record<number, string> = {
    1: "자기계발",
    2: "마음건강",
    3: "관계&소통",
    4: "창의활동",
    5: "신체활동",
    6: "식습관",
    7: "문화생활",
    8: "지식확장",
    9: "경제습관",
    10: "생활습관",
    11: "휴식&재충전",
    12: "자기이해",
    13: "도전&성취",
};

export type CategoryBadgeStyle = { bg: string; text: string };

export const CATEGORY_BADGE: Record<string, CategoryBadgeStyle> = {
    자기계발: { bg: "#FFE2D0", text: "#FF7018" },
    마음건강: { bg: "#FFE4EC", text: "#E34E77" },
    "관계&소통": { bg: "#EAF2FF", text: "#2A66CC" },
    창의활동: { bg: "#F2EFFF", text: "#6C53D7" },
    신체활동: { bg: "#E6F4EA", text: "#2E7D32" },
    식습관: { bg: "#E8F6D4", text: "#5C9B00" },
    문화생활: { bg: "#FFF6E5", text: "#E37D00" },
    지식확장: { bg: "#EDF0FF", text: "#4953C4" },
    경제습관: { bg: "#FFF1E6", text: "#D96B00" },
    생활습관: { bg: "#D9E0FF", text: "#4366FF" },
    "휴식&재충전": { bg: "#F3E8FF", text: "#7E3AF2" },
    자기이해: { bg: "#FFE8F0", text: "#D72672" },
    "도전&성취": { bg: "#E8F7FF", text: "#0086C9" },
    기타: { bg: "#E3E3E3", text: "#6F6F6F" },
};

export const toCategoryName = (id: number) => CATEGORY_MAP[id] ?? "기타";

/* ===========================
 * 시간 관련
 * =========================== */

export type TimeCode = OpuEntity["required_time"] | "ALL";

export const TIME_LABEL_MAP: Record<TimeCode, string> = {
    ALL: "소요시간 전체",
    "1M": "1분",
    "5M": "5분",
    "30M": "30분",
    "1H": "1시간",
    DAILY: "1일",
};

export const TIME_CODE_TO_MINUTES: Record<Exclude<TimeCode, "ALL">, number> = {
    "1M": 1,
    "5M": 5,
    "30M": 30,
    "1H": 60,
    DAILY: 1440,
};

export const TIME_OPTIONS: { code: TimeCode; label: string }[] = [
    { code: "ALL", label: TIME_LABEL_MAP.ALL },
    { code: "1M", label: TIME_LABEL_MAP["1M"] },
    { code: "5M", label: TIME_LABEL_MAP["5M"] },
    { code: "30M", label: TIME_LABEL_MAP["30M"] },
    { code: "1H", label: TIME_LABEL_MAP["1H"] },
    { code: "DAILY", label: TIME_LABEL_MAP.DAILY },
];

export function mapTimeToLabel(code: TimeCode): string {
    return TIME_LABEL_MAP[code] ?? "소요시간 전체";
}

export function mapMinutesToLabel(minutes: number | null): string {
    if (minutes == null) return "매일";
    if (minutes === 60) return "1시간";
    if (minutes === 1440) return "1일";
    return `${minutes}분`;
}

export function mapTimeToRequiredMinutes(
    time: TimeCode | null
): number | undefined {
    if (!time || time === "ALL") return undefined;
    return TIME_CODE_TO_MINUTES[time];
}

/* ===========================
 * 필터링 유틸
 * =========================== */

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

/* ===========================
 * 정렬 유틸
 * =========================== */

export type SortOption = "name" | "latest" | "completed" | "liked";

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
