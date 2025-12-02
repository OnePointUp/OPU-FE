export type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: {
        code: string;
        message: string;
    } | null;
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
