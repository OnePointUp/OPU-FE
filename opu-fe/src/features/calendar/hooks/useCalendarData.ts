"use client";

import { useEffect, useState } from "react";
import {
  fetchMonthlyStatistics,
  fetchTodosByDate,
} from "@/features/todo/service";

import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { buildCalendarMatrix } from "@/features/calendar/utils/buildCalendarMatrix";
import { CALENDAR_COLORS } from "@/mocks/api/db/calendar.db";

/** 비율 → intensity(0~5) 변환 함수 */
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

/**
 * year, month → CalendarDay[] + CalendarDay[][](6×7)
 */
export function useCalendarData(year: number, month: number) {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (CalendarDay | null)[][]
  >([]);

  useEffect(() => {
    async function load() {
      /** 1) 월간 통계 조회 */
      const stats = await fetchMonthlyStatistics(year, month);

      /** 2) 매트릭스 기본 생성 */
      const baseMatrix = buildCalendarMatrix(
        stats.map((s) => ({
          date: s.date,
          totalCount: s.totalCount,
          completedCount: s.completedCount,
        })),
        year,
        month
      );

      /** 3) flat 배열 생성 */
      const flatDays = baseMatrix.flat().filter(Boolean) as CalendarDay[];

      /** 4) Todos 병렬 fetch */
      const todosList = await Promise.all(
        flatDays.map((d) => fetchTodosByDate(d.date))
      );

      /** 5) CalendarDay 최종 조립 */
      const filledDays = flatDays.map((day, idx) => {
        const stat = stats.find((s) => s.date === day.date);

        const total = stat?.totalCount ?? 0;
        const completed = stat?.completedCount ?? 0;

        const intensity = calcIntensity(total, completed);

        return {
          ...day,
          todos: todosList[idx] ?? [],
          color: CALENDAR_COLORS[intensity],
        };
      });

      /** 6) 매트릭스로 다시 조립 */
      let index = 0;
      const filledMatrix = baseMatrix.map((week) =>
        week.map((day) => {
          if (!day) return null;
          const filled = filledDays[index];
          index++;
          return filled;
        })
      );

      /** 7) 상태 저장 */
      setCalendarMatrix(filledMatrix);
      setCalendarData(filledDays);
    }

    load();
  }, [year, month]);

  return { calendarData, calendarMatrix };
}
