"use client";

import { Icon } from "@iconify/react";

type CalendarHeaderProps = {
  year: number;
  month: number; // 0~11
  onPrev: () => void;
  onNext: () => void;
  onClickYear: () => void;
};

export default function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
  onClickYear,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 select-none">
      <button onClick={onPrev} className="p-2 cursor-pointer">
        <Icon icon="mingcute:left-line" width={22} />
      </button>

      {/* 연도·월 클릭 → WheelPicker 연도 선택 모달 열림 */}
      <button
        onClick={onClickYear}
        className="text-lg font-semibold flex items-center gap-1 cursor-pointer"
      >
        {year}년 {month + 1}월
      </button>

      <button onClick={onNext} className="p-2 cursor-pointer">
        <Icon icon="mingcute:right-line" width={22} />
      </button>
    </div>
  );
}
