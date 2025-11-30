"use client";

import { useState, useEffect } from "react";
import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";

import DaySelector from "./DaySelector";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type Props = {
  selectedDay: DailyTodoStats | null;
  onSelectDay: (day: DailyTodoStats) => void;
};

export default function MonthlyCalendar({ selectedDay, onSelectDay }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);

  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const [tempSelectedDate, setTempSelectedDate] = useState<{
    y: number;
    m: number;
    d: number;
  } | null>(null);

  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 📌 월이 바뀔 때 캘린더 즉시 생성
  useEffect(() => {
    const data = getMonthlyCalendar(year, month);
    setCalendarData(data);
    setCalendarMatrix(buildCalendarMatrix(data));
  }, [year, month]);

  // 📌 날짜 변경 반영
  useEffect(() => {
    if (!tempSelectedDate) return;

    const { y, m, d } = tempSelectedDate;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;

    const found = calendarData.find((day) => day.date === dateStr);
    if (found) onSelectDay(found);

  }, [tempSelectedDate, calendarData]); // ← 핵심 로직 유지

  const handleDateSelect = (y: number, m: number, d: number) => {
    setTempSelectedDate({ y, m, d });
    setYear(y);
    setMonth(m);
  };

  const getWeekOf = (
    dateStr: string | undefined
  ): (DailyTodoStats | null)[] => {
    if (!dateStr) return calendarMatrix[0] ?? [];
    for (const week of calendarMatrix) {
      if (week.some((d) => d?.date === dateStr)) return week;
    }
    return calendarMatrix[0] ?? [];
  };

  return (
    <div className="mb-8 flex flex-col items-center pb-[10px] rounded-[12px]">
      <div className="w-full max-w-[358px] mx-auto">

        {/* 날짜 선택 헤더 */}
        <DaySelector
          year={year}
          month={month}
          day={
            tempSelectedDate
              ? tempSelectedDate.d
              : selectedDay
              ? new Date(selectedDay.date).getDate()
              : 1
          }
          onSelect={handleDateSelect}
          onToggleView={() =>
            setViewMode(viewMode === "month" ? "week" : "month")
          }
          viewMode={viewMode}
        />

        {/* Month / Week 뷰 */}
        <div className="flex flex-col justify-center items-center rounded-[12px] border border-[var(--color-super-light-gray)] py-[10px]">
          
          {/* 요일 */}
          <div className="grid grid-cols-7 mb-2 gap-2 inline-grid">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className={`w-10 h-10 flex items-center justify-center text-sm ${
                  day === "일"
                    ? "text-red-500"
                    : "text-[var(--color-dark-gray)]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 월 / 주 뷰 */}
          <div
            className={`overflow-hidden relative transition-all duration-300 ease-in-out ${
              viewMode === "month" ? "max-h-[500px]" : "max-h-[120px]"
            }`}
          >
            {viewMode === "month" ? (
              <MonthView
                calendarMatrix={calendarMatrix}
                selectedDay={selectedDay}
                onSelectDay={onSelectDay}
                todayStr={todayStr}
              />
            ) : (
              <WeekView
                week={getWeekOf(selectedDay?.date)}
                selectedDay={selectedDay}
                onSelectDay={onSelectDay}
                todayStr={todayStr}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
