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
