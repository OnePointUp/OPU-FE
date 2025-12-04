"use client";

import { CALENDAR_COLORS, DailyTodoStats } from "@/mocks/api/db/calendar.db";

export default function MonthView({
  calendarMatrix,
  selectedDay,
  onSelectDay,
  todayStr,
  loading = false, // ← 추가
}: {
  calendarMatrix: (DailyTodoStats | null)[][];
  selectedDay: DailyTodoStats | null;
  onSelectDay: (d: DailyTodoStats) => void;
  todayStr: string;
  loading?: boolean; // ← 추가
}) {
  // Skeleton class
  const skeletonClass =
    "bg-gray-200 animate-pulse rounded-lg border border-gray-300";

  /* ---------------------------------------------------------
     ⭐ 1) 로딩 시 Skeleton 캘린더 표시
     --------------------------------------------------------- */
  if (loading || calendarMatrix.length === 0) {
    // 기본적으로 6주(6 rows) 렌더링하는 skeleton
    const weeks = Array.from({ length: 6 });
    const days = Array.from({ length: 7 });

    return (
      <div className="grid grid-cols-7 gap-2 inline-grid mx-auto">
        {weeks.map((_, i) =>
          days.map((_, j) => (
            <div
              key={`skeleton-${i}-${j}`}
              className={`w-10 h-10 ${skeletonClass}`}
            />
          ))
        )}
      </div>
    );
  }

  /* ---------------------------------------------------------
     ⭐ 2) 실제 캘린더 UI 렌더링
     --------------------------------------------------------- */
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
                ${
                  day.date === todayStr
                    ? "font-bold text-[var(--color-dark-navy)]"
                    : ""
                }
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
