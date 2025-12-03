"use client";

import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { sortTodos } from "./useCalendarData";
import { toggleTodo } from "@/mocks/api/handler/calendar.handler";

export function useTodoActions(
  selectedDay: DailyTodoStats | null,
  calendarData: DailyTodoStats[],
  updateCalendarData: (newData: DailyTodoStats[]) => void,
  setEditingTodoId: (id: number | null) => void
) {
  /** 공통 업데이트 helper */
  const updateDay = (
    date: string,
    updater: (day: DailyTodoStats) => DailyTodoStats
  ) => {
    const updated = calendarData.map((day) =>
      day.date === date ? updater(day) : day
    );

    updateCalendarData(updated);
    return updated.find((d) => d.date === date) ?? null;
  };

  /** 체크 토글 */
  const handleToggle = (todoId: number) => {
    if (!selectedDay) return;

    const [y, m] = selectedDay.date.split("-").map(Number);
    toggleTodo(y, m, selectedDay.date, todoId);

    return updateDay(selectedDay.date, (day) => {
      let todos = day.todos.map((t) =>
        t.id === todoId ? { ...t, done: !t.done } : t
      );
      todos = sortTodos(todos);

      return {
        ...day,
        todos,
        doneCount: todos.filter((t) => t.done).length,
        total: todos.length,
      };
    });
  };

  /** 수정 */
  const handleEdit = (
    todoId: number,
    newTitle: string,
    time: DailyTodoStats["todos"][number]["time"]
  ) => {
    if (!selectedDay) return;

    updateDay(selectedDay.date, (day) => {
      let todos = day.todos.map((t) =>
        t.id === todoId ? { ...t, title: newTitle, time } : t
      );

      return { ...day, todos: sortTodos(todos) };
    });

    setEditingTodoId(null);
  };

  /** 삭제 */
  const handleDelete = (todoId: number) => {
    if (!selectedDay) return;

    updateDay(selectedDay.date, (day) => {
      let todos = day.todos.filter((t) => t.id !== todoId);
      todos = sortTodos(todos);

      return {
        ...day,
        todos,
        doneCount: todos.filter((t) => t.done).length,
        total: todos.length,
      };
    });
  };

  /** 신규 Todo 생성 */
  const handleAdd = () => {
    if (!selectedDay) return;

    const newId =
      selectedDay.todos.length > 0
        ? Math.max(...selectedDay.todos.map((t) => t.id)) + 1
        : 1;

    updateDay(selectedDay.date, (day) => ({
      ...day,
      todos: sortTodos([...day.todos, { id: newId, title: "", done: false, time: null }]),
    }));

    setEditingTodoId(newId);
  };

  /** 신규 입력 확정 */
  const handleConfirm = (
    todoId: number,
    title: string,
    time: DailyTodoStats["todos"][number]["time"]
  ) => {
    handleEdit(todoId, title, time);
  };

  return {
    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  };
}
