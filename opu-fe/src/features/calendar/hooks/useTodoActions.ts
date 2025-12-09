"use client";

import {
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
} from "@/features/todo/service";

import type { Todo } from "@/features/todo/domain";

export type SelectedDayData = {
  date: string;
  todos: Todo[];
};

/* ==== AM/PM → HH:mm 변환 ==== */
function convertTo24Hour(time: {
  ampm: "AM" | "PM";
  hour: number;
  minute: number;
}): string {
  let { ampm, hour, minute } = time;

  // PM 이면서 12시가 아닌 경우 +12
  if (ampm === "PM" && hour !== 12) {
    hour += 12;
  }

  // AM 이면서 12시는 00시로
  if (ampm === "AM" && hour === 12) {
    hour = 0;
  }

  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");

  return `${hh}:${mm}:00`;
}

export function useTodoActions(
  selectedDay: SelectedDayData | null,
  refreshSelectedDay: (date: string) => Promise<void>,
  setEditingTodoId: (id: number | null) => void
) {
  /* ===== 완료 토글 ===== */
  const handleToggle = async (todoId: number, completed: boolean) => {
    if (!selectedDay) return;

    await updateTodoStatus(todoId, { completed });
    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 수정 ===== */
  const handleEdit = async (
    todoId: number,
    newTitle: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => {
    if (!selectedDay) return;

    await updateTodo(todoId, {
      title: newTitle,
      scheduledTime: time ? convertTo24Hour(time) : null,
    });

    setEditingTodoId(null);
    await refreshSelectedDay(selectedDay.date);

    console.log("📌 UPDATE PAYLOAD:", { todoId, title: newTitle, scheduledTime: time ? convertTo24Hour(time) : null, });
  };

  /* ===== 삭제 ===== */
  const handleDelete = async (todoId: number) => {
    if (!selectedDay) return;

    await deleteTodo(todoId);
    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 생성 ===== */
  const handleAdd = async () => {
    if (!selectedDay) return;

    const newId = await createTodo({
      title: "",
      scheduledDate: selectedDay.date,
      scheduledTime: null,
    });

    setEditingTodoId(newId);
    await refreshSelectedDay(selectedDay.date);
  };

  /* ===== 신규 Todo 입력 확정 ===== */
  const handleConfirm = async (
    todoId: number,
    title: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => {
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
