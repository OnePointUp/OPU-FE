"use client";

import {
  createTodo,
  updateTodoStatus,
  deleteTodo,
} from "@/features/todo/service";

import type { Todo } from "@/features/todo/domain";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { CALENDAR_COLORS } from "@/mocks/api/db/calendar.db";
import { calcIntensity } from "@/features/main/utils/calcIntensity";

/* =========================
   AM/PM → HH:mm 변환
========================= */
function convertTo24Hour(time: {
  ampm: "AM" | "PM";
  hour: number;
  minute: number;
}): string {
  let { ampm, hour, minute } = time;

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}:00`;
}

/* =========================
   임시 Todo ID
========================= */
function createTempId() {
  return -Date.now();
}

/* =========================
   useTodoActions
========================= */
export function useTodoActions(
  selectedDay: CalendarDay | null,
  setSelectedDay: React.Dispatch<
    React.SetStateAction<CalendarDay | null>
  >,
  refreshSelectedDay: (date: string) => Promise<void>,
  setEditingTodoId: (id: number | null) => void,
  setCalendarMatrix: React.Dispatch<
    React.SetStateAction<(CalendarDay | null)[][]>
  >
) {
  /* =========================
     공통 calendarMatrix 업데이트 헬퍼
  ========================= */
  const updateCalendarDayTodos = (
    date: string,
    updateFn: (todos: Todo[]) => Todo[]
  ) => {
    setCalendarMatrix((prev) =>
      prev.map((week) =>
        week.map((day) => {
          if (!day || day.date !== date) return day;

          const updatedTodos = updateFn(day.todos);
          const completed = updatedTodos.filter((t) => t.completed).length;
          const intensity = calcIntensity(
            updatedTodos.length,
            completed
          );

          return {
            ...day,
            todos: updatedTodos,
            color: CALENDAR_COLORS[intensity],
          };
        })
      )
    );
  };

  /* ===== 완료 토글 ===== */
  const handleToggle = async (todoId: number, completed: boolean) => {
    if (!selectedDay || todoId < 0) return;

    await updateTodoStatus(todoId, { completed });

    updateCalendarDayTodos(selectedDay.date, (todos) =>
      todos.map((t) =>
        t.id === todoId ? { ...t, completed } : t
      )
    );

    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 삭제 ===== */
  const handleDelete = async (todoId: number) => {
    if (!selectedDay) return;

    if (todoId >= 0) {
      await deleteTodo(todoId);
    }

    updateCalendarDayTodos(selectedDay.date, (todos) =>
      todos.filter((t) => t.id !== todoId)
    );

    setSelectedDay((prev) =>
      prev
        ? { ...prev, todos: prev.todos.filter((t) => t.id !== todoId) }
        : prev
    );

    setEditingTodoId(null);
    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 생성 (임시 Todo) ===== */
  const handleAdd = async () => {
    if (!selectedDay) return;

    const tempId = createTempId();

    const tempTodo: Todo = {
      id: tempId,
      title: "",
      content: null,
      scheduledDate: selectedDay.date,
      scheduledTime: null,
      completed: false,
      order: selectedDay.todos.length,
    };

    updateCalendarDayTodos(selectedDay.date, (todos) => [
      ...todos,
      tempTodo,
    ]);

    setSelectedDay((prev) =>
      prev ? { ...prev, todos: [...prev.todos, tempTodo] } : prev
    );

    setEditingTodoId(tempId);
  };

  /* ===== 신규 Todo 입력 확정 ===== */
  const handleConfirm = async (
    todoId: number,
    title: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => {
    if (!selectedDay) return;

    if (todoId < 0) {
      const newId = await createTodo({
        title,
        scheduledDate: selectedDay.date,
        scheduledTime: time ? convertTo24Hour(time) : null,
      });

      updateCalendarDayTodos(selectedDay.date, (todos) =>
        todos.map((t) =>
          t.id === todoId
            ? {
                ...t,
                id: newId,
                title,
                scheduledTime: time
                  ? convertTo24Hour(time)
                  : null,
              }
            : t
        )
      );

      setEditingTodoId(null);
      await refreshSelectedDay(selectedDay.date);
    }
  };

  return {
    handleToggle,
    handleDelete,
    handleAdd,
    handleConfirm,
  };
}
