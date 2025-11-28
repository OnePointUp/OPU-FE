"use client";

import { useState, useEffect } from "react";
import {
  getMonthlyCalendar,
  toggleTodo,
} from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

import Calendar from "@/features/main/components/Calendar";
import TodoList from "@/features/main/components/TodoList";
import PlusButton from "@/components/common/PlusButton";
import CalendarFull from "../components/CalendarFull";

/** ⭐ 미완료 → 완료 순 정렬 */
const sortTodos = (todos: DailyTodoStats["todos"]) => {
  return [...todos].sort((a, b) => {
    if (a.done === b.done) return a.id - b.id; // 상태 같으면 id순
    return a.done ? 1 : -1; // 완료(true)는 아래로
  });
};

export default function MainPage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  /** 초기 로드 */
  useEffect(() => {
    const data = getMonthlyCalendar(year, month);

    // 날짜 로드 시에도 todos 정렬 적용
    const sorted = data.map((d) => ({
      ...d,
      todos: sortTodos(d.todos),
    }));

    setCalendarData(sorted);
    setCalendarMatrix(buildCalendarMatrix(sorted));

    if (!selectedDay) {
      const today = sorted.find((d) => d.isToday);
      if (today) setSelectedDay(today);
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

        const doneCount = todos.filter((t) => t.done).length;
        const total = todos.length;
        const ratio = total > 0 ? doneCount / total : 0;

        return { ...day, todos, doneCount, total, ratio };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected =
        updated.find((d) => d.date === selectedDay.date) ?? null;

      setSelectedDay(newSelected);

      return updated;
    });
  };

  /** ⭐ 제목 + 시간 수정 */
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

      const newSelected =
        updated.find((d) => d.date === selectedDay.date) ?? null;

      setSelectedDay(newSelected);

      return updated;
    });

    setEditingTodoId(null);
  };

  /** 삭제 */
  const handleDeleteTodo = (todoId: number) => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.filter((todo) => todo.id !== todoId);

        todos = sortTodos(todos);

        const doneCount = todos.filter((t) => t.done).length;
        const total = todos.length;
        const ratio = total > 0 ? doneCount / total : 0;

        return { ...day, todos, total, doneCount, ratio };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected =
        updated.find((d) => d.date === selectedDay.date) ?? null;

      setSelectedDay(newSelected);

      return updated;
    });
  };

  /** 새 Todo 추가 */
  const handleAddTodo = () => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        const newId =
          day.todos.length > 0
            ? Math.max(...day.todos.map((t) => t.id)) + 1
            : 1;

        const newTodo = { id: newId, title: "", done: false, time: null };

        let todos = [...day.todos, newTodo];
        todos = sortTodos(todos);

        const doneCount = todos.filter((t) => t.done).length;
        const total = todos.length;
        const ratio = total > 0 ? doneCount / total : 0;

        return { ...day, todos, total, doneCount, ratio };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected =
        updated.find((d) => d.date === selectedDay.date) ?? null;

      setSelectedDay(newSelected);

      return updated;
    });

    const newId =
      selectedDay.todos.length > 0
        ? Math.max(...selectedDay.todos.map((t) => t.id)) + 1
        : 1;

    setEditingTodoId(newId);
  };

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">
        <CalendarFull
        calendarMatrix={calendarMatrix}
        selectedDay={selectedDay}
        onSelectDay={handleSelectDay}
        />

        <TodoList
          selectedDay={selectedDay}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
          editingTodoId={editingTodoId}
        />

        <PlusButton showMenu={true} onAddEvent={handleAddTodo} />
      </main>
    </div>
  );
}
