"use client";

import { useState, useEffect } from "react";
import { useCalendarData, sortTodos } from "./useCalendarData";
import { useSelectedDay } from "./useSelectedDay";
import { useTodoActions } from "./useTodoActions";

export function useCalendarCore() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const { calendarData, calendarMatrix, updateCalendarData } =
    useCalendarData(year, month);

  const { selectedDay, setSelectedDay, selectDay } = useSelectedDay();

  // Todo 액션 모음
  const actions = useTodoActions(
    selectedDay,
    calendarData,
    updateCalendarData,
    setEditingTodoId
  );

  /** 오늘 날짜 자동 선택 */
  useEffect(() => {
    if (!selectedDay && calendarData.length > 0) {
      const todayItem = calendarData.find((d) => d.isToday);
      if (todayItem) {
        setSelectedDay({
          ...todayItem,
          todos: sortTodos(todayItem.todos),
        });
      }
    }
  }, [calendarData, selectedDay]);

  return {
    year,
    month,
    calendarData,
    calendarMatrix,
    selectedDay,
    editingTodoId,

    setYear,
    setMonth,
    setSelectedDay,
    selectDay,
    setEditingTodoId,

    ...actions,
  };
}
