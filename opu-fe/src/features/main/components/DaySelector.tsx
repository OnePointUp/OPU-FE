"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CalendarPicker from "./CalendarPicker";

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

  /** Picker로 넘길 초기 선택 날짜 */
  const initialDate = new Date(year, month - 1, day);

  /** Picker에서 날짜 선택 후 MonthSelector로 다시 전달 */
  const handleSelect = (date: Date) => {
    onSelect(date.getFullYear(), date.getMonth() + 1, date.getDate());
    setOpen(false);
  };

  return (
    <div className={className}>
      {/* 상단 Year/Month + View Toggle */}
      <div className="flex justify-between items-center w-full mt-[10px] mb-[20px]">
        {/* 날짜 표시 버튼 (클릭 시 Modal Picker 열림) */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-xl font-semibold"
        >
          {year}년 {month}월
          <Icon icon="iconamoon:arrow-down-2-thin" width={20} height={20} />
        </button>

        {/* Month/Week 전환 버튼 */}
        <button
          onClick={onToggleView}
          className="px-3 py-[2px] rounded-full bg-[var(--color-light-blue-gray)] text-[var(--text-mini)] text-gray-600 font-medium"
        >
          {viewMode === "month" ? "월" : "주"}
        </button>
      </div>

      {/* CalendarPicker 모달 (단일 컴포넌트) */}
      <CalendarPicker
        open={open}
        onClose={() => setOpen(false)}
        initial={initialDate}
        onSelect={handleSelect}
      />
    </div>
  );
}
