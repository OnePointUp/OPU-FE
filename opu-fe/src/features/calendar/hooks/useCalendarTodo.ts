"use client";

import { useState, useEffect } from "react";
import {
  getMonthlyCalendar,
  toggleTodo,
} from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

/** 미완 → 완료 순 정렬 */
const sortTodos = (todos: DailyTodoStats["todos"]) => {
  return [...todos].sort((a, b) => {
    if (a.done === b.done) return a.id - b.id;
    return a.done ? 1 : -1;
  });
};

export function useCalendarTodo() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);

  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  /** 초기 데이터 로딩 */
  useEffect(() => {
    const data = getMonthlyCalendar(year, month);

    const sorted = data.map((d) => ({
      ...d,
      todos: sortTodos(d.todos),
    }));

    setCalendarData(sorted);
    setCalendarMatrix(buildCalendarMatrix(sorted));

    if (!selectedDay) {
      const todayItem = sorted.find((d) => d.isToday);
      if (todayItem) setSelectedDay(todayItem);
    }
  }, [year, month]);

  /** 날짜 선택 */
  const handleSelectDay = (day: DailyTodoStats) => {
    const date = new Date(day.date);

    setEditingTodoId(null);
    setSelectedDay({ ...day, todos: sortTodos(day.todos) });

    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  /** Todo 체크 */
  const handleToggleTodo = (todoId: number) => {
    if (!selectedDay) return;

    const [y, m] = selectedDay.date.split("-").map(Number);
    toggleTodo(y, m, selectedDay.date, todoId);

    updateDayData(selectedDay.date, (day) => {
      let todos = day.todos.map((todo) =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo
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

  /** Todo 수정 */
  const handleEditTodo = (
    todoId: number,
    newTitle: string,
    time: DailyTodoStats["todos"][number]["time"]
  ) => {
    if (!selectedDay) return;

    updateDayData(selectedDay.date, (day) => {
      let todos = day.todos.map((todo) =>
        todo.id === todoId ? { ...todo, title: newTitle, time } : todo
      );
      todos = sortTodos(todos);

      return { ...day, todos };
    });

    setEditingTodoId(null);
  };

  /** Todo 삭제 */
  const handleDeleteTodo = (todoId: number) => {
    if (!selectedDay) return;

    updateDayData(selectedDay.date, (day) => {
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

  /** Todo 추가 */
  const handleAddTodo = () => {
    if (!selectedDay) return;

    const newId =
      selectedDay.todos.length > 0
        ? Math.max(...selectedDay.todos.map((t) => t.id)) + 1
        : 1;

    const newTodo = { id: newId, title: "", done: false, time: null };

    updateDayData(selectedDay.date, (day) => ({
      ...day,
      todos: sortTodos([...day.todos, newTodo]),
    }));

    setEditingTodoId(newId);
  };

  /** Todo 입력 완료 */
  const handleConfirmNewTodo = (
    todoId: number,
    title: string,
    time: DailyTodoStats["todos"][number]["time"]
  ) => {
    handleEditTodo(todoId, title, time);
  };

  /** 특정 날짜의 데이터를 업데이트하는 helper */
  const updateDayData = (
    date: string,
    updater: (day: DailyTodoStats) => DailyTodoStats
  ) => {
    setCalendarData((prev) => {
      const updated = prev.map((day) =>
        day.date === date ? updater(day) : day
      );

      setCalendarMatrix(buildCalendarMatrix(updated));
      setSelectedDay(updated.find((d) => d.date === date) ?? null);

      return updated;
    });
  };

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
    setEditingTodoId,

    handleSelectDay,
    handleToggleTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleAddTodo,
    handleConfirmNewTodo,
  };
}
