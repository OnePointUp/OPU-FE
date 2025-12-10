"use client";

import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

export function useCalendarWeek() {
  function buildWeekCells(
    week: (CalendarDay | null)[],
    weekIndex: number,
    matrixStartDate: Date
  ): CalendarDay[] {
    return week.map((day, di) => {
      const offset = weekIndex * 7 + di;

      const dateObj = new Date(matrixStartDate);
      dateObj.setDate(matrixStartDate.getDate() + offset);

      const y = dateObj.getFullYear();
      const m = dateObj.getMonth() + 1;
      const d = dateObj.getDate();
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;

      const todayStr = new Date().toISOString().split("T")[0];

      if (!day) {
        // preview day
        return {
          date: dateStr,
          isPreview: true,
          isToday: dateStr === todayStr,
          todos: [],
        };
      }

      // 실제 날짜면 날짜만 재계산해서 유지
      return {
        ...day,
      };
    });
  }

  return { buildWeekCells };
}
