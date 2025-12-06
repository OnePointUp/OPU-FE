"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { useCalendarWeek } from "@/features/calendar/hooks/useCalendarWeek";

type Props = {
  calendarMatrix: (DailyTodoStats | null)[][];
  selectedDay: DailyTodoStats | null;
  onSelectDay: (day: DailyTodoStats) => void;
  cellHeight: number;
};

export default function CalendarFull({
  calendarMatrix,
  selectedDay,
  onSelectDay,
  cellHeight,
}: Props) {
  const { buildWeekCells } = useCalendarWeek();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (calendarMatrix.length > 0) {
      const t = setTimeout(() => setIsLoading(false), 150);
      return () => clearTimeout(t);
    }
  }, [calendarMatrix]);

  if (isLoading) {
    return (
      <div className="w-full select-none animate-pulse">
        {[...Array(6)].map((_, row) => (
          <div key={row} className="grid grid-cols-7 w-full">
            {[...Array(7)].map((_, col) => (
              <div key={col} className="p-2" style={{ height: cellHeight }}>
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

  const firstRealDay = calendarMatrix.flat().find((d) => d !== null)!;
  const firstDateObj = new Date(firstRealDay.date);
  const matrixStartDate = new Date(firstDateObj);
  matrixStartDate.setDate(firstDateObj.getDate() - firstDateObj.getDay());

  return (
    <div className="w-full select-none">
      {calendarMatrix.map((week, wi) => {
        const cells = buildWeekCells(week, wi, matrixStartDate);

        return (
          <div
            key={wi}
            className="grid grid-cols-7 w-full"
            style={{
              borderTop:
                wi === 0 ? "1px solid var(--color-super-light-gray)" : "none",
            }}
          >
            {cells.map((day, di) => {
              const isSelected = selectedDay?.date === day.date;

              return (
                <div
                  key={day.date}
                  onClick={() => onSelectDay(day)}
                  style={{
                    height: cellHeight,
                    opacity: day.isPreview ? 0.3 : 1,
                    border: isSelected
                      ? "1px solid var(--color-opu-pink)"
                      : "1px solid transparent",
                  }}
                  className="px-1 flex flex-col cursor-pointer rounded-md transition-all"
                >
                  {/* 날짜 숫자 */}
                  <div
                    className={clsx(
                      "text-xs mb-1 flex justify-center relative",
                      day.isToday && "text-[var(--color-opu-pink)] font-semibold"
                    )}
                  >
                    {Number(day.date.split("-")[2])}

                    {day.isToday && (
                      <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-[2px] rounded bg-[var(--color-opu-pink)]" />
                    )}
                  </div>

                  {/* Todo 목록 */}
                  {!day.isPreview && (
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

                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
