"use client";

type CalendarDay = {
  day: number;
  currentMonth: boolean;
};

type CalendarGridProps = {
  days: CalendarDay[];
  selectedDay: number;
  today: Date;
  currentYear: number;
  currentMonth: number; // 0~11
  onSelect: (day: number) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarGrid({
  days,
  selectedDay,
  today,
  currentYear,
  currentMonth,
  onSelect,
}: CalendarGridProps) {
  return (
    <div className="select-none">

      {/* 요일 */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={`w-10 h-10 flex items-center justify-center text-sm
              ${day === "일" ? "text-red-500" : "text-[var(--color-dark-gray)]"}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((d, i) => {
          const isSelected = d.currentMonth && d.day === selectedDay;

          const isToday =
            d.currentMonth &&
            today.getFullYear() === currentYear &&
            today.getMonth() === currentMonth &&
            today.getDate() === d.day;

          return (
            <div key={i} className="flex justify-center items-center">
              <button
                onClick={() => d.currentMonth && onSelect(d.day)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full transition-all
                  ${
                    !d.currentMonth
                      ? "text-gray-300"
                      : isSelected
                      ? "bg-[var(--color-opu-light-green)] text-black font-semibold"
                      : isToday
                      ? "text-[var(--color-opu-green)] font-semibold"
                      : "text-black"
                  }
                `}
              >
                {d.day}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
