"use client";

import { useEffect, useState } from "react";
import { fetchMonthlyStatistics, fetchTodosByDate } from "@/features/todo/service";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

import { buildCalendarMatrix } from "@/features/calendar/utils/buildCalendarMatrix";

async function buildFilledMatrix(y: number, m: number) {
  const stats = await fetchMonthlyStatistics(y, m);

  const normalized = stats.map((s) => ({
    date: s.date,
    totalCount: s.totalCount,
    completedCount: s.completedCount,
  }));

  const baseMatrix = buildCalendarMatrix(normalized, y, m);

  const flatDays = baseMatrix.flat().filter(Boolean) as CalendarDay[];

  const todosList = await Promise.all(
    flatDays.map((d) => fetchTodosByDate(d.date))
  );

  const filledDays = flatDays.map((day, idx) => ({
    ...day,
    todos: todosList[idx] ?? [],
  }));

  let index = 0;
  const filledMatrix = baseMatrix.map((week) =>
    week.map((day) => {
      if (!day) return null;
      const updated = filledDays[index];
      index++;
      return updated;
    })
  );

  return filledMatrix;
}

export function useCalendarSlideMatrices(year: number, month: number) {
  const [prevMatrix, setPrevMatrix] = useState<(CalendarDay | null)[][]>([]);
  const [currentMatrix, setCurrentMatrix] = useState<(CalendarDay | null)[][]>([]);
  const [nextMatrix, setNextMatrix] = useState<(CalendarDay | null)[][]>([]);

  useEffect(() => {
    async function run() {
      const pm = month - 1 < 1 ? 12 : month - 1;
      const py = month - 1 < 1 ? year - 1 : year;

      const nm = month + 1 > 12 ? 1 : month + 1;
      const ny = month + 1 > 12 ? year + 1 : year;

      setPrevMatrix(await buildFilledMatrix(py, pm));
      setCurrentMatrix(await buildFilledMatrix(year, month));
      setNextMatrix(await buildFilledMatrix(ny, nm));
    }

    run();
  }, [year, month]);

  return { prevMatrix, currentMatrix, nextMatrix };
}
