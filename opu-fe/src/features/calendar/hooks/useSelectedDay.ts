"use client";

import { useState } from "react";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { sortTodos } from "./useCalendarData";

export function useSelectedDay() {
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  /** 날짜 선택 */
  const selectDay = (day: DailyTodoStats) => {
    setSelectedDay({
      ...day,
      todos: sortTodos(day.todos),
    });
  };

  return {
    selectedDay,
    setSelectedDay,
    selectDay,
  };
}
