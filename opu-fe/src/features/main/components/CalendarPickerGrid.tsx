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

export default function CalendarGrid({
  days,
  selectedDay,
  today,
  currentYear,
  currentMonth,
  onSelect,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 px-4 gap-y-2 text-center select-none">
      {/* 요일 */}
      {["일", "월", "화", "수", "목", "금", "토"].map((w, i) => (
        <div
          key={i}
          className="text-gray-400 text-[13px] font-medium"
        >
          {w}
        </div>
      ))}

      {/* 날짜 */}
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
                w-9 h-9 flex items-center justify-center rounded-full transition-all
                ${
                  !d.currentMonth
                    ? "text-gray-300" // 이전/다음 달
                    : isSelected
                    ? "bg-[var(--color-opu-light-green)] text-black font-semibold" // 선택된 날짜
                    : isToday
                    ? "text-[var(--color-opu-green)] font-semibold" // 오늘 날짜 스타일
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
  );
}
