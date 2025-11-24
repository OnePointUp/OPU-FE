"use client";

import { CALENDAR_COLORS, DailyTodoStats } from "@/mocks/api/db/calendar.db";

export default function MonthView({
  calendarMatrix,
  selectedDay,
  onSelectDay,
  todayStr,
}: {
  calendarMatrix: (DailyTodoStats | null)[][];
  selectedDay: DailyTodoStats | null;
  onSelectDay: (d: DailyTodoStats) => void;
  todayStr: string; // ← 추가
}) {
  return (
    <div className="grid grid-cols-7 gap-2 inline-grid mx-auto">
      {calendarMatrix.map((week, i) =>
        week.map((day, j) =>
          day ? (
            <button
              key={day.date}
              onClick={() => onSelectDay(day)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                text-agreement-optional text-[var(--color-dark-blue-gray)]
                ${day.date === todayStr ? "font-bold underline text-[var(--color-dark-navy)]" : ""}
              `}
              style={{
                backgroundColor: CALENDAR_COLORS[day.intensity],
                border:
                  selectedDay?.date === day.date
                    ? "2px solid var(--color-opu-dark-green)"
                    : "1px solid #eee",
              }}
            >
              {new Date(day.date).getDate()}
            </button>
          ) : (
            <div
              key={`empty-${i}-${j}`}
              className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100"
            />
          )
        )
      )}
    </div>
  );
}
