import type { RoutineFrequency } from "./domain";

export type RoutineListItemResponse = {
    id: number;
    startDate: string;
    endDate: string | null;
    title: string;
    frequency: RoutineFrequency;
    active: number;
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
