'use client';

import { useState, useEffect } from "react";
import { getMonthlyCalendar, toggleTodo } from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

import Calendar from "../components/Calendar";
import TodoList from "../components/TodoList";

export default function MainPage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<(DailyTodoStats | null)[][]>([]);
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  useEffect(() => {
    const data = getMonthlyCalendar(year, month);
    setCalendarData(data);
    setCalendarMatrix(buildCalendarMatrix(data));

    if (!selectedDay) {
      const today = data.find((d) => d.isToday);
      if (today) setSelectedDay(today);
    }
  }, [year, month]);

  // 날짜 선택
  const handleSelectDay = (day: DailyTodoStats) => {
    const date = new Date(day.date);

    setSelectedDay(day);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  // todo 체크박스 toggle
const handleToggleTodo = (todoId: number) => {
  if (!selectedDay) return;

  // 👉 mock store는 그대로 유지(원하면 생략해도 됨)
  const [y, m] = selectedDay.date.split("-").map(Number);
  toggleTodo(y, m, selectedDay.date, todoId);

  // 👉 React state는 "새 객체"로 업데이트해야 리렌더가 된다
  setCalendarData((prev) => {
    if (!prev.length) return prev;

    const updated = prev.map((day) => {
      if (day.date !== selectedDay.date) return day;

      // 이 날짜의 todos만 새 배열로 복사 + 특정 todo만 토글
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

      // day도 새 객체로 반환
      return {
        ...day,
        todos,
        doneCount,
        total,
        ratio,
        intensity,
      };
    });

    // 캘린더 매트릭스도 새 데이터로 다시 계산
    setCalendarMatrix(buildCalendarMatrix(updated));

    // selectedDay도 새 객체로 교체
    const newSelected = updated.find((d) => d.date === selectedDay.date) ?? null;
    setSelectedDay(newSelected);

    return updated;
  });
};

// todo 제목 수정
const handleEditTodo = (todoId: number, newTitle: string) => {
  if (!selectedDay) return;

  setCalendarData(prev => {
    const updated = prev.map(day => {
      if (day.date !== selectedDay.date) return day;

      const todos = day.todos.map(todo =>
        todo.id === todoId ? { ...todo, title: newTitle } : todo
      );

      return {
        ...day,
        todos,
      };
    });

    setCalendarMatrix(buildCalendarMatrix(updated));

    const newSelected = updated.find(d => d.date === selectedDay.date) ?? null;
    setSelectedDay(newSelected);

    return updated;
  });
};

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

      return {
        ...day,
        todos,
        total,
        doneCount,
        ratio,
        intensity,
      };
    });

    setCalendarMatrix(buildCalendarMatrix(updated));

    const newSelected = updated.find(d => d.date === selectedDay.date) ?? null;
    setSelectedDay(newSelected);

    return updated;
  });
};

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">

        <Calendar
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        <TodoList
          selectedDay={selectedDay}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
        />

      </main>
    </div>
  );
}
