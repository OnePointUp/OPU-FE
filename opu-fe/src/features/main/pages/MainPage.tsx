'use client';

import { useState, useEffect } from "react";
import { getMonthlyCalendar, toggleTodo } from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

import Calendar from "../components/Calendar";
import TodoList from "../components/TodoList";
import PlusButton from "@/components/common/PlusButton";

export default function MainPage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<(DailyTodoStats | null)[][]>([]);
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  useEffect(() => {
    const data = getMonthlyCalendar(year, month);
    setCalendarData(data);
    setCalendarMatrix(buildCalendarMatrix(data));

    if (!selectedDay) {
      const today = data.find((d) => d.isToday);
      if (today) setSelectedDay(today);
    }
  }, [year, month]);

  /** 날짜 선택시 MainPage에서 year/month를 업데이트까지 수행 */
  const handleSelectDay = (day: DailyTodoStats) => {
    const date = new Date(day.date);

    setSelectedDay(day);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  /** TODO 체크 토글 */
  const handleToggleTodo = (todoId: number) => {
    if (!selectedDay) return;

    const [y, m] = selectedDay.date.split("-").map(Number);
    toggleTodo(y, m, selectedDay.date, todoId);

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        const todos = day.todos.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo
        );

        const doneCount = todos.filter((t) => t.done).length;
        const total = todos.length;
        const ratio = total > 0 ? doneCount / total : 0;

        let intensity = 0;
        if (doneCount === 0) intensity = 0;
        else if (ratio >= 0.8) intensity = 5;
        else if (ratio >= 0.6) intensity = 4;
        else if (ratio >= 0.4) intensity = 3;
        else if (ratio >= 0.2) intensity = 2;
        else intensity = 1;

        return { ...day, todos, doneCount, total, ratio, intensity };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected = updated.find((d) => d.date === selectedDay.date) ?? null;
      setSelectedDay(newSelected);

      return updated;
    });
  };

  /** TODO 제목 수정 */
  const handleEditTodo = (todoId: number, newTitle: string) => {
    if (!selectedDay) return;

    setCalendarData(prev => {
      const updated = prev.map(day => {
        if (day.date !== selectedDay.date) return day;

        const todos = day.todos.map(todo =>
          todo.id === todoId ? { ...todo, title: newTitle } : todo
        );

        return { ...day, todos };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected = updated.find(d => d.date === selectedDay.date) ?? null;
      setSelectedDay(newSelected);

      return updated;
    });

    setEditingTodoId(null);
  };

  /** TODO 삭제 */
  const handleDeleteTodo = (todoId: number) => {
    if (!selectedDay) return;

    setCalendarData(prev => {
      const updated = prev.map(day => {
        if (day.date !== selectedDay.date) return day;

        const todos = day.todos.filter(todo => todo.id !== todoId);

        const doneCount = todos.filter(t => t.done).length;
        const total = todos.length;
        const ratio = total > 0 ? doneCount / total : 0;

        let intensity = 0;
        if (doneCount === 0) intensity = 0;
        else if (ratio >= 0.8) intensity = 5;
        else if (ratio >= 0.6) intensity = 4;
        else if (ratio >= 0.4) intensity = 3;
        else if (ratio >= 0.2) intensity = 2;
        else intensity = 1;

        return { ...day, todos, total, doneCount, ratio, intensity };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected = updated.find(d => d.date === selectedDay.date) ?? null;
      setSelectedDay(newSelected);

      return updated;
    });
  };

  /** 새 Todo 생성 */
  const handleAddTodo = () => {
    if (!selectedDay) return;

    setCalendarData(prev => {
      const updated = prev.map(day => {
        if (day.date !== selectedDay.date) return day;

        const newId = day.todos.length > 0 ? Math.max(...day.todos.map(t => t.id)) + 1 : 1;

        const newTodo = { id: newId, title: "", done: false };
        const todos = [...day.todos, newTodo];

        const doneCount = todos.filter(t => t.done).length;
        const total = todos.length;
        const ratio = total > 0 ? doneCount / total : 0;

        let intensity = 0;
        if (doneCount === 0) intensity = 0;
        else if (ratio >= 0.8) intensity = 5;
        else if (ratio >= 0.6) intensity = 4;
        else if (ratio >= 0.4) intensity = 3;
        else if (ratio >= 0.2) intensity = 2;
        else intensity = 1;

        return { ...day, todos, total, doneCount, ratio, intensity };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));

      const newSelected = updated.find(d => d.date === selectedDay.date) ?? null;
      setSelectedDay(newSelected);

      return updated;
    });

    const newId =
      selectedDay.todos.length > 0
        ? Math.max(...selectedDay.todos.map(t => t.id)) + 1
        : 1;

    setEditingTodoId(newId);
  };

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">
        <Calendar
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

        <PlusButton onDirectCreate={handleAddTodo} />
      </main>
    </div>
  );
}
