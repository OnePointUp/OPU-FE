"use client";

import clsx from "clsx";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";

type Props = {
  calendarMatrix: (DailyTodoStats | null)[][];
  selectedDay: DailyTodoStats | null;
  onSelectDay: (day: DailyTodoStats) => void;
};

const getDayNumber = (date: string) => Number(date.split("-")[2]);
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarFull({
  calendarMatrix,
  selectedDay,
  onSelectDay,
}: Props) {
  return (
    <div className="w-full select-none">

      {/* 요일 */}
      <div className="grid grid-cols-7 text-sm text-gray-500 mb-3">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={`h-10 flex items-center justify-center text-sm ${
              day === "일" ? "text-red-500" : "text-[var(--color-dark-gray)]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 */}
      <div className="w-full">
        {calendarMatrix.map((week, wi) => (
          <div key={wi} className="w-full">

            {/* ⭐ 위쪽 가로 보더 */}
            <div className="grid grid-cols-7">
              <div className="col-span-7 border-t border-[var(--color-super-light-gray)]" />
            </div>

            {/* 날짜 7칸 */}
            <div className="grid grid-cols-7">
              {week.map((day, di) => {
                if (!day) {
                  return <div key={`${wi}-${di}`} className="h-24" />;
                }

                const isSelected = selectedDay?.date === day.date;
                const dayNumber = getDayNumber(day.date);

                return (
                  <div
                    key={day.date}
                    className={clsx(
                      "h-24 px-1 cursor-pointer rounded-md transition-all flex flex-col",
                      isSelected && "border border-pink-300 bg-pink-50"
                    )}
                    onClick={() => onSelectDay(day)}
                  >
                    {/* 날짜 */}
                    <div
                      className={clsx(
                        "text-xs mb-1 flex items-center justify-center",
                        day.isToday && "text-pink-600 font-semibold"
                      )}
                    >
                      {dayNumber}
                    </div>

                    {/* 투두 */}
                    <div className="relative overflow-hidden flex-1">
                      <div className="text-[10px] flex flex-col gap-[2px] leading-tight">
                        {day.todos.map((t) => (
                          <div
                            key={t.id}
                            className={clsx(
                              "truncate",
                              t.done
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            )}
                          >
                            {t.title}
                          </div>
                        ))}
                      </div>

                      {/* 블러 */}
                      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 마지막 주 아래선 */}
        <div className="grid grid-cols-7">
          <div className="col-span-7 border-b border-[var(--color-super-light-gray)]" />
        </div>
      </div>
    </div>
  );
}
