"use client";

import { useState, useEffect } from "react";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { getMonthlyCalendar } from "@/mocks/api/handler/calendar.handler";
import { buildCalendarMatrix } from "@/lib/calendar";

import DaySelector from "./DaySelector";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

type Props = {
  selectedDay: DailyTodoStats | null;
  onSelectDay: (day: DailyTodoStats) => void;
};

export default function MonthlyCalendar({ selectedDay, onSelectDay }: Props) {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(11);
  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<(DailyTodoStats | null)[][]>([]);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // MonthSelector에서 선택한 날짜를 임시 저장
  const [tempSelectedDate, setTempSelectedDate] = useState<{
    y: number;
    m: number;
    d: number;
  } | null>(null);

  // 월/년 변경 → 달력 데이터 갱신
  useEffect(() => {
    const monthData = getMonthlyCalendar(year, month);
    setCalendarData(monthData);
    setCalendarMatrix(buildCalendarMatrix(monthData));
  }, [year, month]);

  // tempSelectedDate가 있고, calendarData가 새로 갱신되면 selectedDay 다시 설정
  useEffect(() => {
    if (!tempSelectedDate) return;

    const { y, m, d } = tempSelectedDate;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const found = calendarData.find((day) => day.date === dateStr);
    if (found) {
      onSelectDay(found);
    }
  }, [calendarData]);

 // MonthSelector → 날짜 선택 핸들러
  const handleDateSelect = (y: number, m: number, d: number) => {
    setYear(y);
    setMonth(m);
    setTempSelectedDate({ y, m, d });
  };

  // 선택된 날짜가 포함된 주(WeekView용)
  const getWeekOf = (dateStr: string | undefined) => {
    if (!dateStr) return calendarMatrix[0] ?? [];
    for (const week of calendarMatrix) {
      if (week.some((d) => d?.date === dateStr)) {
        return week;
      }
    }
    return calendarMatrix[0] ?? [];
  };

  return (
    <div className="mb-8 flex flex-col items-center pb-[10px] rounded-[12px]">
      <div className="w-full max-w-[358px] mx-auto">

        {/* 년/월 선택 (CalendarPicker 모달 포함) */}
        <DaySelector
          year={year}
          month={month}
          day={selectedDay?.date ? new Date(selectedDay.date).getDate() : 1}
          onSelect={handleDateSelect}
          onToggleView={() =>
            setViewMode(viewMode === "month" ? "week" : "month")
          }
          viewMode={viewMode}
        />

        <div className="flex flex-col justify-center items-center rounded-[12px] border border-[var(--color-super-light-gray)] py-[10px]">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-2 gap-2 inline-grid">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className={`w-10 h-10 flex items-center justify-center text-sm
                  ${day === "일" ? "text-red-500" : "text-[var(--color-dark-gray)]"}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Month ↔ Week 전환 애니메이션 */}
          <div
            className={`
              overflow-hidden relative
              transition-all duration-300 ease-in-out
              ${viewMode === "month" ? "max-h-[500px]" : "max-h-[120px]"}
            `}
          >
            {/* MonthView */}
            <div
              className={`
                transition-all duration-300
                ${viewMode === "month"
                  ? "opacity-100 translate-y-0 relative"
                  : "opacity-0 -translate-y-4 absolute inset-0 pointer-events-none"}
              `}
            >
              <MonthView
                calendarMatrix={calendarMatrix}
                selectedDay={selectedDay}
                onSelectDay={onSelectDay}
              />
            </div>

            {/* WeekView */}
            <div
              className={`
                transition-all duration-300
                ${viewMode === "week"
                  ? "opacity-100 translate-y-0 relative"
                  : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"}
              `}
            >
              <WeekView
                week={getWeekOf(selectedDay?.date)}
                selectedDay={selectedDay}
                onSelectDay={onSelectDay}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
