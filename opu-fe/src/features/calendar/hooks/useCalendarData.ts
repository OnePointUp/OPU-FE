"use client";

import { useEffect, useState } from "react";
import {
  fetchMonthlyStatistics,
  fetchTodosByDate,
} from "@/features/todo/service";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { buildCalendarMatrix } from "@/features/calendar/utils/buildCalendarMatrix";

export function useCalendarData(year: number, month: number) {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (CalendarDay | null)[][]
  >([]);

  useEffect(() => {
    async function load() {
      // 1) 월간 통계 가져오기
      const stats = await fetchMonthlyStatistics(year, month);

      // 2) 기본 매트릭스 생성 (todos = [])
      const baseMatrix = buildCalendarMatrix(
        stats.map((s) => ({
          date: s.date,
          totalCount: s.totalCount,
          completedCount: s.completedCount,
        })),
        year,
        month
      );

      // 3) flat days
      const flatDays = baseMatrix.flat().filter(Boolean) as CalendarDay[];

      // 4) 날짜별 todos 전부 fetch (병렬)
      const todosList = await Promise.all(
        flatDays.map((d) => fetchTodosByDate(d.date))
      );

      // 5) CalendarDay에 todos 삽입
      const filledDays = flatDays.map((day, idx) => ({
        ...day,
        todos: todosList[idx] ?? [],
      }));

      // 6) filledDays 기반으로 다시 매트릭스 조립
      let index = 0;
      const filledMatrix = baseMatrix.map((week) =>
        week.map((day) => {
          if (!day) return null;
          const updated = filledDays[index];
          index++;
          return updated;
        })
      );

      setCalendarMatrix(filledMatrix);
      setCalendarData(filledDays);
    }

    load();
  }, [year, month]);

  return {
    calendarData,
    calendarMatrix,
  };
}
