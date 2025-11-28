import { RoutineFrequency } from "./domain";

export type RoutineFormValue = {
    id?: number;
    title: string;
    color: string;
    frequency: RoutineFrequency;
    startDate: string | null;
    endDate: string | null;
    time: string | null;
};

// 백엔드로 보낼 생성/수정 DTO (mock 기준)
export type CreateRoutinePayload = {
    title: string;
    frequency: RoutineFrequency;
    startDate: string;
    endDate?: string | null;
    time?: string | null;
    color: string;
};

export type UpdateRoutinePayload = Partial<CreateRoutinePayload> & {
    id: number;
};
