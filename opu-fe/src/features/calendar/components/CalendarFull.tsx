"use client";

import clsx from "clsx";
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
  return (
    <div className="w-full select-none">

      {/* 요일 */}
      <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-[var(--color-dark-gray)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      {calendarMatrix.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 w-full">

          {week.map((day, di) => {
            // 빈 칸(이전/다음달)
            if (!day) {
              return (
                <div
                  key={`${wi}-${di}`}
                  style={{ height: cellHeight }}
                />
              );
            }

            const isSelected = selectedDay?.date === day.date;

            return (
              <div
                key={day.date}
                style={{ height: cellHeight }}
                onClick={() => onSelectDay(day)}
                className={clsx(
                  "px-1 cursor-pointer flex flex-col transition-all rounded-md",
                  isSelected && "border border-pink-300 bg-pink-50"
                )}
              >
                {/* 날짜 숫자 */}
                <div
                  className={clsx(
                    "text-xs mb-1 flex justify-center",
                    day.isToday && "text-pink-600 font-semibold"
                  )}
                >
                  {Number(day.date.split("-")[2])}
                </div>

                {/* Todo 리스트 */}
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

                  {/* Fade-out 블러 */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}

        </div>
      ))}

      {/* 마지막 아래선 */}
      <div className="grid grid-cols-7">
        <div className="col-span-7 border-b border-[var(--color-super-light-gray)]" />
      </div>
    </div>
  );
}
