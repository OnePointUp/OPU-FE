'use client'

import { useState, useEffect } from "react";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

import MonthlyCalendar from "../components/Calendar";;
import TodoList from "../components/TodoList";

export default function IntroPage() {
  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<(DailyTodoStats | null)[][]>([]);
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  useEffect(() => {
    const data = getMonthlyCalendar(2025, 11);
    setCalendarData(data);

    const matrix = buildCalendarMatrix(data);
    setCalendarMatrix(matrix);

    const today = data.find((d) => d.isToday);
    if (today) setSelectedDay(today);
  }, []);

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">
        {/* 캘린더 컴포넌트 */}
        <MonthlyCalendar
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* 투두 컴포넌트 */}
        <TodoList selectedDay={selectedDay} />
      </main>
    </div>
  );
}
