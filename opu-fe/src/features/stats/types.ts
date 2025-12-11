export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export type CalendarCell = {
    date: string;
    completedCount?: number; // OPU용
    intensity?: number; // OPU용
    hasTodo?: boolean; // Routine용
    done?: boolean; // Routine용
};

// 캘린더 색상 (단계별 색)
export const CALENDAR_COLORS: Record<number, string> = {
    0: "rgb(248, 248, 248)",
    1: "rgba(205, 233, 144, 0.25)",
    2: "rgba(205, 233, 144, 0.45)",
    3: "rgba(205, 233, 144, 0.65)",
    4: "rgba(205, 233, 144, 0.98)",
};

/* 월별 OPU 통계 요청 파라미터 */
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

/* 월별 루틴 통계 요청 파라미터 */
export type FetchMonthlyRoutineStatsParams = {
    routineId: number;
    year?: number; // 안 넘기면 현재 연도
    month?: number; // 안 넘기면 현재 월
};

/* 월별 루틴 통계 응답 */
export type RoutineCalendarDayDto = {
    date: string;
    hasTodo: boolean;
    done: boolean;
};

export type RoutineCalendarResponse = {
    routineId: number;
    title: string;
    color: string;
    year: number;
    month: number;
    days: RoutineCalendarDayDto[];
};

export type RoutineMonthlyStatsResponse = {
    routineId: number;
    year: number;
    month: number;
    achievementRate: number;
    streakDays: number;
    completedCount: number;
    scheduledCount: number;
};

/* 일별 OPU 완료 횟수 */
export type OpuCalendarDayDto = {
    date: string;
    completedCount: number;
};

export type OpuCalendarResponse = {
    year: number;
    month: number;
    days: OpuCalendarDayDto[];
};

export type RoutineFilterItem = {
    id: number;
    title: string;
};

export type RoutineSummaryResponse = {
    id?: number;
    routineId?: number;
    title: string;
};
