"use client";

import { useMemo } from "react";
import { buildCalendarMatrix } from "@/lib/calendar";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";

export function useCalendarSlideMatrices(year: number, month: number) {
  const prev = useMemo(() => {
    const m = month - 1;
    const y = m < 1 ? year - 1 : year;
    const mm = m < 1 ? 12 : m;
    return getMonthlyCalendar(y, mm);
  }, [year, month]);

  const current = useMemo(() => {
    return getMonthlyCalendar(year, month);
  }, [year, month]);

  const next = useMemo(() => {
    const m = month + 1;
    const y = m > 12 ? year + 1 : year;
    const mm = m > 12 ? 1 : m;
    return getMonthlyCalendar(y, mm);
  }, [year, month]);

  return {
    prevMatrix: buildCalendarMatrix(prev),
    currentMatrix: buildCalendarMatrix(current),
    nextMatrix: buildCalendarMatrix(next),
  };
}
