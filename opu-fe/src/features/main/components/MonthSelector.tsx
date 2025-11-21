"use client";

import { useState } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import WheelPicker from "@/components/common/WheelPicker";
import { Icon } from "@iconify/react";

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

  const years = Array.from({ length: 46 }, (_, i) => 1990 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);
  const [tempDay, setTempDay] = useState(day);

  const daysInMonth = new Date(tempYear, tempMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const confirm = () => {
    onSelect(tempYear, tempMonth, tempDay);
    setOpen(false);
  };

  return (
    <div className={className}>
      {/* 상단 Year / Month + 주 버튼 */}
      <div className="flex justify-between items-center w-full mt-[10px] mb-[20px]">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-xl font-semibold"
        >
          {year}년 {month}월
          <Icon icon="iconamoon:arrow-down-2-thin" width={20} height={20} />
        </button>

        {/* 주/월 전환 버튼 */}
        <button
          onClick={onToggleView}
          className="px-3 py-[2px] rounded-full bg-[var(--color-light-blue-gray)] text-[var(--text-mini)] text-gray-600 font-medium"
        >
          {viewMode === "month" ? "월" : "주"}
        </button>
      </div>

      {/* 날짜 선택 BottomSheet */}
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col pb-6 items-center">

          <div className="text-center font-semibold text-[18px] py-4">
            날짜 설정
          </div>

          <div className="grid grid-cols-3 w-full px-4 gap-4">
            <WheelPicker
              items={years}
              value={tempYear}
              onChange={(v) => {
                const y = Number(v);
                setTempYear(y);
                const maxDay = new Date(y, tempMonth, 0).getDate();
                if (tempDay > maxDay) setTempDay(maxDay);
              }}
            />

            <WheelPicker
              items={months}
              value={tempMonth}
              onChange={(v) => {
                const m = Number(v);
                setTempMonth(m);
                const maxDay = new Date(tempYear, m, 0).getDate();
                if (tempDay > maxDay) setTempDay(maxDay);
              }}
            />

            <WheelPicker
              items={days}
              value={tempDay}
              onChange={(v) => setTempDay(Number(v))}
            />
          </div>

          <button
            onClick={confirm}
            className="w-full mt-6 py-3 mx-4 rounded-xl bg-[var(--color-opu-light-green)] text-black font-semibold"
          >
            완료
          </button>

        </div>
      </BottomSheet>
    </div>
  );
}
