import { PageResponse } from "@/types/api";

/* ===========================
 * 정렬 옵션 (백엔드 ENUM과 1:1 매핑)
 * =========================== */
export type OpuSortOption = "NEWEST" | "NAME_ASC" | "COMPLETION" | "FAVORITE";

/* ===========================
 * API 응답 / 카드 모델
 * =========================== */
export type CategoriesResponse = {
    id: number;
    name: string;
};

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

export type OpuDuplicateItem = {
    opuId: number;
    title: string;
    requiredMinutes: number;
    categoryId: number;
};

export type OpuRegisterResponse =
    | {
          created: true;
          opuId: number;
      }
    | {
          created: false;
          duplicates: OpuDuplicateItem[];
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
 * 공통 타입
 * =========================== */
export type CategoryMap = Record<number, string>;
export type CategoryBadgeStyle = { bg: string; text: string };
export type SortOption = "name" | "latest" | "completed" | "liked";
