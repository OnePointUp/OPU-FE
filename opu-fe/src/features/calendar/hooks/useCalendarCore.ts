"use client";

import { useState, useEffect } from "react";
import { useCalendarData } from "./useCalendarData";
import { useSelectedDay } from "./useSelectedDay";
import { useTodoActions } from "./useTodoActions";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

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

  /** ✔ 월간 CalendarDay[] & 6×7 매트릭스 */
  const { calendarData, calendarMatrix } = useCalendarData(year, month);

  /** ✔ 선택된 날짜 + 해당 날짜 todos */
  const { selectedDay, setSelectedDay, selectDay, refreshSelectedDay } =
    useSelectedDay();

  /** ✔ Todo 액션 */
  const actions = useTodoActions(selectedDay, refreshSelectedDay, setEditingTodoId);

  /** ⭐ 최초 로딩 시 오늘 날짜 자동 선택 (가장 안정적인 방식) */
  useEffect(() => {
    if (!selectedDay && calendarMatrix.length > 0) {
      // 매트릭스 전체 flatten
      const allDays = calendarMatrix.flat().filter(Boolean) as CalendarDay[];

      // isToday = true 인 셀 찾기
      const todayCell = allDays.find((d) => d.isToday);

      if (todayCell) {
        selectDay(todayCell.date); // Todo API 불러오기
      }
    }
  }, [calendarMatrix, selectedDay]);

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
