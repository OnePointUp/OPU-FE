"use client";

import { useState, useEffect } from "react";
import {
  getMonthlyCalendar,
  toggleTodo,
} from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

import Calendar from "../components/Calendar";
import TodoList from "../components/TodoList";
import PlusButton from "@/components/common/PlusButton";

const sortTodos = (todos: DailyTodoStats["todos"]) => {
  return [...todos].sort((a, b) => {
    if (a.done === b.done) return a.id - b.id;
    return a.done ? 1 : -1;
  });
};

export default function MainPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  /** 초기 로드 + 월/년 변경 시 */
  useEffect(() => {
    const data = getMonthlyCalendar(year, month);

    const sorted = data.map((d) => ({
      ...d,
      todos: sortTodos(d.todos),
    }));

    setCalendarData(sorted);
    setCalendarMatrix(buildCalendarMatrix(sorted));

    if (!selectedDay) {
      const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const todayItem = sorted.find((d) => d.date === todayStr);

      if (todayItem) {
        setSelectedDay(todayItem);
      }
    }
  }, [year, month]);

  /** 날짜 선택 */
  const handleSelectDay = (day: DailyTodoStats) => {
    const date = new Date(day.date);

    setSelectedDay({
      ...day,
      todos: sortTodos(day.todos),
    });

    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setEditingTodoId(null);
  };

  /** 체크 토글 */
  const handleToggleTodo = (todoId: number) => {
    if (!selectedDay) return;

    const [y, m] = selectedDay.date.split("-").map(Number);
    toggleTodo(y, m, selectedDay.date, todoId);

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

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

      setCalendarMatrix(buildCalendarMatrix(updated));

      setSelectedDay(
        updated.find((d) => d.date === selectedDay.date) ?? null
      );

      return updated;
    });
  };

  const handleEditTodo = (
    todoId: number,
    newTitle: string,
    time: any
  ) => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, title: newTitle, time: time ?? undefined }
            : todo
        );

        todos = sortTodos(todos);

        return { ...day, todos };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      setSelectedDay(
        updated.find((d) => d.date === selectedDay.date) ?? null
      );

      return updated;
    });

    setEditingTodoId(null);
  };

  const handleDeleteTodo = (todoId: number) => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.filter((todo) => todo.id !== todoId);
        todos = sortTodos(todos);

        return {
          ...day,
          todos,
          doneCount: todos.filter((t) => t.done).length,
          total: todos.length,
        };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      setSelectedDay(
        updated.find((d) => d.date === selectedDay.date) ?? null
      );

      return updated;
    });
  };

  const handleAddTodo = () => {
    if (!selectedDay) return;

    const newId =
      selectedDay.todos.length > 0
        ? Math.max(...selectedDay.todos.map((t) => t.id)) + 1
        : 1;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        const tempTodo = { id: newId, title: "", done: false, time: null };
        let todos = [...day.todos, tempTodo];

        todos = sortTodos(todos);

        return { ...day, todos };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      setSelectedDay(
        updated.find((d) => d.date === selectedDay.date) ?? null
      );

      return updated;
    });

    setEditingTodoId(newId);
  };

  const handleConfirmNewTodo = (todoId: number, title: string, time: any) => {
    if (!selectedDay) return;
    handleEditTodo(todoId, title, time);
  };

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">
        <Calendar selectedDay={selectedDay} onSelectDay={handleSelectDay} />

        <TodoList
          selectedDay={selectedDay}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
          onConfirmNewTodo={handleConfirmNewTodo}
          editingTodoId={editingTodoId}
        />

        <PlusButton showMenu={true} onAddEvent={handleAddTodo} />
      </main>
    </div>
  );
}
