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

export function useTodoActions(
  selectedDay: SelectedDayData | null,
  refreshSelectedDay: (date: string) => Promise<void>,
  setEditingTodoId: (id: number | null) => void
) {
  /** 완료 체크 토글 */
  const handleToggle = async (todoId: number, completed: boolean) => {
    if (!selectedDay) return;

    await updateTodoStatus(todoId, { completed });
    await refreshSelectedDay(selectedDay.date);
  };

  /** 수정 */
  const handleEdit = async (todoId: number, newTitle: string) => {
    if (!selectedDay) return;

    await updateTodo(todoId, { title: newTitle });

    setEditingTodoId(null);
    await refreshSelectedDay(selectedDay.date);
  };

  /** 삭제 */
  const handleDelete = async (todoId: number) => {
    if (!selectedDay) return;

    await deleteTodo(todoId);
    await refreshSelectedDay(selectedDay.date);
  };

  /** 추가 */
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

  /** 신규 입력 확정 */
  const handleConfirm = async (todoId: number, title: string) => {
    await handleEdit(todoId, title);
  };

  return {
    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  };
}
