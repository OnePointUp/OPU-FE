"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";

type Props = {
  calendarMatrix: (DailyTodoStats | null)[][];
  selectedDay: DailyTodoStats | null;
  onSelectDay: (day: DailyTodoStats) => void;
  cellHeight: number;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarFull({
  calendarMatrix,
  selectedDay,
  onSelectDay,
  cellHeight,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (calendarMatrix.length > 0) {
      const t = setTimeout(() => setIsLoading(false), 350);
      return () => clearTimeout(t);
    }
  }, [calendarMatrix]);

  const WeekdayHeader = (
    <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className={`flex items-center justify-center text-center aspect-square
              ${
                  day === "일"
                      ? "text-[var(--color-sunday)]"
                      : day === "토"
                      ? "text-[var(--color-saturday)]"
                      : "text-[var(--color-dark-gray)]"
              }
          `}
          style={{ fontSize: "var(--text-caption)" }}
        >
          {day}
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full select-none animate-pulse">
        {WeekdayHeader}

        {/* 날짜 6주 Skeleton */}
        {[...Array(6)].map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-7 w-full border-t border-gray-100"
          >
            {[...Array(7)].map((_, col) => (
              <div
                key={`${row}-${col}`}
                style={{ height: cellHeight }}
                className="p-2"
              >
                <div className="w-5 h-3 bg-gray-200 rounded mb-2" />
                <div className="space-y-1">
                  <div className="w-10 h-2 bg-gray-200 rounded" />
                  <div className="w-8 h-2 bg-gray-200 rounded" />
                  <div className="w-12 h-2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full select-none transition-opacity duration-300">
      {WeekdayHeader}

      {calendarMatrix.map((week, wi) => (
        <div
          key={wi}
          className="grid grid-cols-7 w-full border-t border-[var(--color-super-light-gray)]"
        >
          {week.map((day, di) => {
            if (!day) {
              return (
                <div key={`${wi}-${di}`} style={{ height: cellHeight }} />
              );
            }

            const isSelected = selectedDay?.date === day.date;
            const isToday = day.isToday;

            return (
              <div
                key={day.date}
                onClick={() => onSelectDay(day)}
                style={{
                  height: cellHeight,
                  borderColor: isSelected
                    ? "var(--color-opu-pink)"
                    : "transparent",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
                className={clsx(
                  "px-1 cursor-pointer flex flex-col transition-all rounded-md bg-white"
                )}
              >
                {/* 날짜 숫자 */}
                <div
                  className={clsx(
                    "text-xs mb-1 flex justify-center relative",
                    isToday && "text-[var(--color-opu-pink)] font-semibold"
                  )}
                >
                  {Number(day.date.split("-")[2])}

                  {isToday && (
                    <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-[2px] rounded bg-[var(--color-opu-pink)]" />
                  )}
                </div>

                {/* 투두 목록 */}
                <div className="relative overflow-hidden flex-1">
                  <div className="text-[10px] flex flex-col gap-[2px] leading-tight">
                    {day.todos.map((t) => (
                      <div
                        key={t.id}
                        className={clsx(
                          "truncate",
                          t.done
                            ? "text-gray-300 line-through"
                            : "text-gray-700"
                        )}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>

                  {/* Fade-out gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
