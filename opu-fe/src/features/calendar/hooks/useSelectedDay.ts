"use client";

import { useState } from "react";
import { fetchTodosByDate } from "@/features/todo/service";
import type { Todo } from "@/features/todo/domain";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

export function useSelectedDay() {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  function getLocalDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /** 날짜 클릭 시 Todo 불러오기 */
  const selectDay = async (date: string) => {
    const todos: Todo[] = await fetchTodosByDate(date);

    const todayStr = getLocalDateString();

    setSelectedDay({
      date,
      todos,           // ← Todo[] 로 들어감 (타입 충돌 없음)
      isToday: date === todayStr,
      isPreview: false,
    });
  };

  /** 토글/수정/삭제 후 다시 로딩 */
  const refreshSelectedDay = async (date: string) => {
    const todos: Todo[] = await fetchTodosByDate(date);

    setSelectedDay((prev) =>
      prev
        ? {
            ...prev,
            todos,
          }
        : null
    );
  };

  return {
    selectedDay,
    selectDay,
    refreshSelectedDay,
    setSelectedDay,
  };
}
