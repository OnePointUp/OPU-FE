import { RoutineFrequency } from "./domain";

export type RoutineFormValue = {
    id?: number;
    title: string;
    color: string;
    frequency: RoutineFrequency;
    startDate: string | null;
    endDate: string | null;
    time: string | null;

    weekDays?: string | null;
    monthDays?: string | null;
    yearDays?: string | null;
};

export type CreateRoutinePayload = {
    title: string;
    frequency: RoutineFrequency;
    startDate: string;
    endDate?: string | null;
    time?: string | null;
    color: string;

    weekDays?: string | null;
    monthDays?: string | null;
    yearDays?: string | null;
};

export type UpdateRoutinePayload = {
    id: number;
} & Partial<CreateRoutinePayload>;
