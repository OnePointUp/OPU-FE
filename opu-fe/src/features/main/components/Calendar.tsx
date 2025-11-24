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
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(11);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);

  const [loadingCalendar, setLoadingCalendar] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const [tempSelectedDate, setTempSelectedDate] = useState<{
    y: number;
    m: number;
    d: number;
  } | null>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 📌 월 바뀔 때 캘린더 로딩
  useEffect(() => {
    setLoadingCalendar(true);

    setTimeout(() => {
      const data = getMonthlyCalendar(year, month);
      setCalendarData(data);
      setCalendarMatrix(buildCalendarMatrix(data));
      setLoadingCalendar(false);
    }, 500); // (연출용)
  }, [year, month]);

  // 📌 임시 선택된 날짜 적용
  useEffect(() => {
    if (!tempSelectedDate) return;
    const { y, m, d } = tempSelectedDate;

    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;
    const found = calendarData.find((day) => day.date === dateStr);
    if (found) onSelectDay(found);
  }, [calendarData]);

  const handleDateSelect = (y: number, m: number, d: number) => {
    setYear(y);
    setMonth(m);
    setTempSelectedDate({ y, m, d });
  };

  const getWeekOf = (dateStr: string | undefined): (DailyTodoStats | null)[] => {
    if (!dateStr) return calendarMatrix[0] ?? [];
    for (const week of calendarMatrix) {
      if (week.some((d) => d?.date === dateStr)) return week;
    }
    return calendarMatrix[0] ?? [];
  };

  /** ---------------------------
   *  📌 Calendar Skeleton UI
   * ---------------------------- */
  const SkeletonCalendar = () => (
    <div className="flex flex-col justify-center items-center rounded-[12px] border border-[var(--color-super-light-gray)] py-[10px]">
      <div className="grid grid-cols-7 mb-2 gap-2 inline-grid w-full px-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-md skeleton" />
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 px-1 w-full">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-md skeleton" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="mb-8 flex flex-col items-center pb-[10px] rounded-[12px]">
      <div className="w-full max-w-[358px] mx-auto">
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

        {loadingCalendar ? (
          <SkeletonCalendar />
        ) : (
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

            {/* Month / Week 전환 */}
            <div
              className={`overflow-hidden relative transition-all duration-300 ease-in-out ${
                viewMode === "month" ? "max-h-[500px]" : "max-h-[120px]"
              }`}
            >
              <div
                className={`transition-all duration-300 ${
                  viewMode === "month"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 absolute inset-0 pointer-events-none"
                }`}
              >
                <MonthView
                  calendarMatrix={calendarMatrix}
                  selectedDay={selectedDay}
                  onSelectDay={onSelectDay}
                  todayStr={todayStr}
                />
              </div>

              <div
                className={`transition-all duration-300 ${
                  viewMode === "week"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                }`}
              >
                <WeekView
                  week={getWeekOf(selectedDay?.date)}
                  selectedDay={selectedDay}
                  onSelectDay={onSelectDay}
                  todayStr={todayStr}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
