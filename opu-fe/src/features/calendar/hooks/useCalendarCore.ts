"use client";

import { useState, useEffect } from "react";
import { useCalendarData } from "./useCalendarData";
import { useSelectedDay } from "./useSelectedDay";
import { useTodoActions } from "../../todo/hooks/useTodoActions";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { CALENDAR_COLORS } from "@/mocks/api/db/calendar.db";
import { calcIntensity } from "@/features/main/utils/calcIntensity";

/** 로컬 기준 yyyy-mm-dd */
function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useCalendarCore() {
  const todayStr = getLocalDateString();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  /** 월간 CalendarDay[] & 6×7 매트릭스 */
  const { calendarData, calendarMatrix, setCalendarMatrix } =
    useCalendarData(year, month);

  /** 선택된 날짜 + 해당 날짜 todos */
  const { selectedDay, setSelectedDay, selectDay, refreshSelectedDay } =
    useSelectedDay();

  /** Todo 액션 */
  const actions = useTodoActions(
    selectedDay,
    setSelectedDay,
    refreshSelectedDay,
    setEditingTodoId,
    setCalendarMatrix
  );

  /** 최초 진입 시 오늘 날짜 자동 선택 */
  useEffect(() => {
    if (!selectedDay && calendarMatrix.length > 0) {
      const allDays = calendarMatrix.flat().filter(Boolean) as CalendarDay[];
      const todayCell = allDays.find((d) => d.isToday);

      if (todayCell) {
        selectDay(todayCell.date);
      }
    }
  }, [calendarMatrix, selectedDay]);

  /** 날짜 변경 시 임시 todo 정리 */
  useEffect(() => {
    if (editingTodoId === null || editingTodoId >= 0) return;

    setCalendarMatrix((prev) =>
      prev.map((week) =>
        week.map((day) => {
          if (!day) return day;

          const hasTemp = day.todos.some((t) => t.id === editingTodoId);
          if (!hasTemp) return day;

          const filteredTodos = day.todos.filter(
            (t) => t.id !== editingTodoId
          );

          const completed = filteredTodos.filter((t) => t.completed).length;
          const intensity = calcIntensity(
            filteredTodos.length,
            completed
          );

          return {
            ...day,
            todos: filteredTodos,
            color: CALENDAR_COLORS[intensity],
          };
        })
      )
    );

    setEditingTodoId(null);
  }, [selectedDay?.date]);

  return {
    year,
    month,

    calendarData,
    calendarMatrix,

    selectedDay,
    editingTodoId,

    // setters
    setYear,
    setMonth,
    setSelectedDay,
    selectDay,
    refreshSelectedDay,
    setEditingTodoId,

    // Todo actions
    ...actions,
  };
}
