"use client";

import clsx from "clsx";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarWeekdayHeader() {
  return (
    <div className="grid grid-cols-7 text-sm text-gray-500">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
            className={clsx(
                        "flex items-center justify-center text-center aspect-square",
                        day === "일"
                        ? "text-[var(--color-sunday)]"
                        : day === "토"
                        ? "text-[var(--color-saturday)]"
                        : "text-[var(--color-dark-gray)]"
                    )}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
