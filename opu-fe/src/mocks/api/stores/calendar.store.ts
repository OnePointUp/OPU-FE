import { DailyTodoStats } from "../db/calendar.db";

export type CalendarStoreType = {
  [year: number]: {
    [month: number]: DailyTodoStats[];
  };
};

// 메모리 저장소
export const calendarStore: CalendarStoreType = {};
