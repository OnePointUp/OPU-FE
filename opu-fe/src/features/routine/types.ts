import type { RoutineFrequency } from "./domain";

export type RoutineListItemResponse = {
    id: number;
    startDate?: string;
    endDate?: string | null;
    title: string;
    frequency?: RoutineFrequency;
    active?: number;
};

export type RoutineDetailResponse = {
    id: number;
    title: string;
    color: string;
    frequency: RoutineFrequency;
    startDate: string;
    endDate: string | null;
    alarmTime: string | null;
    weekDays: string | null;
    monthDays: string | null;
    days: string | null;
    active: boolean;
};

export type RoutineFormValue = {
    id?: number;
    title: string;
    color: string;
    frequency: RoutineFrequency;
    startDate: string | null;
    endDate: string | null;
    alarmTime: string | null;
    weekDays?: string | null;
    monthDays?: string | null;
    yearDays?: string | null;
};

export type EditRoutinePayload = {
    title: string;
    color: string;
    alarmTime: string | null;
    endDate: string | null;
    frequency: RoutineFrequency;
    weekDays?: string | null;
    monthDays?: string | null;
    days?: string | null;
    scope: string;
};

export type CreateRoutinePayload = {
    title: string;
    color: string;
    frequency: RoutineFrequency;
    startDate: string;
    endDate?: string | null;
    alarmTime?: string | null;
    weekDays?: string | null;
    monthDays?: string | null;
    yearDays?: string | null;
};

export type UpdateRoutinePayload = {
    id: number;
} & Partial<CreateRoutinePayload>;

export type DeleteScope = "ALL" | "UNCOMPLETED_TODO";
