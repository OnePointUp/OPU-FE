"use client";

import {
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
} from "@/features/todo/service";

import type { Todo } from "@/features/todo/domain";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { CALENDAR_COLORS } from "@/mocks/api/db/calendar.db";

/* =========================
   타입 (기존 유지)
========================= */
export type SelectedDayData = {
  date: string;
  todos: Todo[];
};

/* =========================
   AM/PM → HH:mm 변환 (기존 유지)
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
   intensity 계산 (기존 정책)
========================= */
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

/* =========================
   임시 Todo ID 생성
========================= */
function createTempId() {
  return -Date.now();
}

/* =========================
   useTodoActions
========================= */
export function useTodoActions(
  selectedDay: SelectedDayData | null,
  refreshSelectedDay: (date: string) => Promise<void>,
  setEditingTodoId: (id: number | null) => void,
  setCalendarMatrix: React.Dispatch<
    React.SetStateAction<(CalendarDay | null)[][]>
  >
) {
  /* ===== 완료 토글 ===== */
  const handleToggle = async (todoId: number, completed: boolean) => {
    if (!selectedDay) return;
    if (todoId < 0) return;

    await updateTodoStatus(todoId, { completed });

    setCalendarMatrix((prev) =>
      prev.map((week) =>
        week.map((day) => {
          if (!day || day.date !== selectedDay.date) return day;

          const updatedTodos = day.todos.map((t) =>
            t.id === todoId ? { ...t, completed } : t
          );

          const done = updatedTodos.filter((t) => t.completed).length;
          const intensity = calcIntensity(updatedTodos.length, done);

          return {
            ...day,
            todos: updatedTodos,
            color: CALENDAR_COLORS[intensity],
          };
        })
      )
    );

    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 수정 ===== */
  const handleEdit = async (
    todoId: number,
    newTitle: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => {
    if (!selectedDay) return;
    if (todoId < 0) return;

    await updateTodo(todoId, {
      title: newTitle,
      scheduledTime: time ? convertTo24Hour(time) : null,
    });

    setEditingTodoId(null);
    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 삭제 ===== */
  const handleDelete = async (todoId: number) => {
    if (!selectedDay) return;

    if (todoId >= 0) {
      await deleteTodo(todoId);
    }

    setCalendarMatrix((prev) =>
      prev.map((week) =>
        week.map((day) => {
          if (!day || day.date !== selectedDay.date) return day;

          const updatedTodos = day.todos.filter((t) => t.id !== todoId);
          const done = updatedTodos.filter((t) => t.completed).length;
          const intensity = calcIntensity(updatedTodos.length, done);

          return {
            ...day,
            todos: updatedTodos,
            color: CALENDAR_COLORS[intensity],
          };
        })
      )
    );

    setEditingTodoId(null);
    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 생성 (임시 Todo만 추가) ===== */
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

    setCalendarMatrix((prev) =>
      prev.map((week) =>
        week.map((day) => {
          if (!day || day.date !== selectedDay.date) return day;

          const updatedTodos = [...day.todos, tempTodo];
          const completed = updatedTodos.filter((t) => t.completed).length;
          const intensity = calcIntensity(updatedTodos.length, completed);

          return {
            ...day,
            todos: updatedTodos,
            color: CALENDAR_COLORS[intensity],
          };
        })
      )
    );

    selectedDay.todos.push(tempTodo);

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

      setCalendarMatrix((prev) =>
        prev.map((week) =>
          week.map((day) => {
            if (!day || day.date !== selectedDay.date) return day;

            const updatedTodos = day.todos.map((t) =>
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
            );

            const completed = updatedTodos.filter((t) => t.completed).length;
            const intensity = calcIntensity(updatedTodos.length, completed);

            return {
              ...day,
              todos: updatedTodos,
              color: CALENDAR_COLORS[intensity],
            };
          })
        )
      );

      setEditingTodoId(null);
      await refreshSelectedDay(selectedDay.date);
      return;
    }

    await handleEdit(todoId, title, time);
  };

  return {
    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  };
}
