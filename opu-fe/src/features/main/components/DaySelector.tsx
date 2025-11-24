"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CalendarPicker from "./CalendarPicker"; // ← dynamic 제거

type Props = {
  year: number;
  month: number;
  day: number;
  onSelect: (y: number, m: number, d: number) => void;
  onToggleView: () => void;
  viewMode: "month" | "week";
  className?: string;
};

export default function MonthSelector({
  year,
  month,
  day,
  onSelect,
  onToggleView,
  viewMode,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const initialDate = new Date(year, month - 1, day);

  const handleSelect = (date: Date) => {
    onSelect(date.getFullYear(), date.getMonth() + 1, date.getDate());
    setOpen(false);
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center w-full mt-[10px] mb-[20px]">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-xl font-semibold"
        >
          {year}년 {month}월
          <Icon icon="iconamoon:arrow-down-2-thin" width={20} height={20} />
        </button>

        <button
          onClick={onToggleView}
          className="px-3 py-[2px] rounded-full bg-[var(--color-light-blue-gray)] 
                     text-[var(--text-mini)] text-gray-600 font-medium"
        >
          {viewMode === "month" ? "월" : "주"}
        </button>
      </div>

      {/* 항상 렌더링, visibility만 제어 */}
      <CalendarPicker
        open={open}
        onClose={() => setOpen(false)}
        initial={initialDate}
        onSelect={handleSelect}
      />
    </div>
  );
}
