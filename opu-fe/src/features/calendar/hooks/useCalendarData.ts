"use client";

import { useEffect, useState } from "react";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";

/** 미완 → 완료 정렬 */
export const sortTodos = (todos: DailyTodoStats["todos"]) =>
  [...todos].sort((a, b) => {
    if (a.done === b.done) return a.id - b.id;
    return a.done ? 1 : -1;
  });

export function useCalendarData(year: number, month: number) {
  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);

  /** 데이터 로딩 */
  useEffect(() => {
    const data = getMonthlyCalendar(year, month);

    const sorted = data.map((d) => ({
      ...d,
      todos: sortTodos(d.todos),
    }));

    setCalendarData(sorted);
    setCalendarMatrix(buildCalendarMatrix(sorted));
  }, [year, month]);

  /** 데이터 통째 업데이트 시 언제든 재계산 가능하도록 helper 제공 */
  const updateCalendarData = (newData: DailyTodoStats[]) => {
    setCalendarData(newData);
    setCalendarMatrix(buildCalendarMatrix(newData));
  };

  return {
    calendarData,
    calendarMatrix,
    updateCalendarData,
  };
}
