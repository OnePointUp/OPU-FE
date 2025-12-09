export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/* 월별 통계 요청 파라미터 */
export type FetchMonthlyStatsParams = {
    year?: number; // 안 넘기면 현재 연도
    month?: number; // 안 넘기면 현재 월
};

/* 상위 완료 OPU 항목 */
export type TopCompletedOpu = {
    opuId: number;
    title: string;
    emoji: string;
    categoryName: string;
    requiredMinutes: number;
    completedCount: number;
};

/* 월별 OPU 통계 응답 */
export type OpuMonthlyStatsResponse = {
    year: number;
    month: number;
    completedDayCount: number;
    completedOpuCount: number;
    randomDrawCount: number;
    topCompletedOpus: TopCompletedOpu[];
};
