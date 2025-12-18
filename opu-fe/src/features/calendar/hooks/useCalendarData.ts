"use client";

import { useEffect, useState } from "react";
import {
  fetchMonthlyStatistics,
  fetchTodosInMonth,
} from "@/features/todo/service";

import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { buildCalendarMatrix } from "@/features/calendar/utils/buildCalendarMatrix";
import { CALENDAR_COLORS } from "@/mocks/api/db/calendar.db";
import { mapTodo } from "@/features/todo/mappers";
import type { Todo } from "@/features/todo/domain";

/** 비율 → intensity(0~5) */
function calcIntensity(total: number, completed: number): number {
  if (total === 0) return 0;
  const ratio = completed / total;
  if (ratio === 0) return 0;
  if (ratio < 0.2) return 1;
  if (ratio < 0.4) return 2;
  if (ratio < 0.6) return 3;
  if (ratio < 0.8) return 4;
  return 5;
}

export function useCalendarData(year: number, month: number) {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (CalendarDay | null)[][]
  >([]);

  useEffect(() => {
    async function load() {
      /** 월간 통계 */
      const stats = await fetchMonthlyStatistics(year, month);

      /** 기본 매트릭스 */
      const baseMatrix = buildCalendarMatrix(
        stats.map((s) => ({
          date: s.date,
          totalCount: s.totalCount,
          completedCount: s.completedCount,
        })),
        year,
        month
      );

      /** flat days */
      const flatDays = baseMatrix.flat().filter(Boolean) as CalendarDay[];

      /** 월간 todos */
      const monthTodos = await fetchTodosInMonth(year, month);

      const todosByDate = new Map(
        monthTodos.days.map((d) => [d.date, d.todos])
      );

      const todosList: Todo[][] = flatDays.map((day) =>
        (todosByDate.get(day.date) ?? []).map(mapTodo)
      );

      /** CalendarDay 조립 */
      const filledDays = flatDays.map((day, idx) => {
        const stat = stats.find((s) => s.date === day.date);

        const total = stat?.totalCount ?? 0;
        const completed = stat?.completedCount ?? 0;
        const intensity = calcIntensity(total, completed);

        return {
          ...day,
          todos: todosList[idx],
          color: CALENDAR_COLORS[intensity],
        };
      });

      /** 매트릭스 재조립 */
      let index = 0;
      const filledMatrix = baseMatrix.map((week) =>
        week.map((day) => (day ? filledDays[index++] : null))
      );

      /** 상태 저장 */
      setCalendarMatrix(filledMatrix);
      setCalendarData(filledDays);
    }

    load();
  }, [year, month]);

  return {
    calendarData,
    calendarMatrix,
    setCalendarMatrix,
  };
}
