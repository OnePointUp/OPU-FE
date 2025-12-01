export type BlockedOpuSummaryDto = {
    opuId: number;
    emoji: string;
    title: string;
    categoryId: number;
    categoryName: string;
    requiredMinutes: number;
    blockedAt: string;
};

export type BlockedOpuFilter = {
    q?: string;
};

export type PageResponse<T> = {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    content: T[];
    hasNext: boolean;
    hasPrevious: boolean;
};
