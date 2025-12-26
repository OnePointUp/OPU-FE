"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import CalendarHeader from "./CalendarPickerHeader";
import CalendarGrid from "./CalendarPickerGrid";
import WheelPickerYearMonth from "./WheelPickerYearMonth";
import { useCalendar } from "../hooks/useCalendarPicker";

type CalendarPickerProps = {
  open: boolean;
  onClose: () => void;
  initial: Date;
  onSelect: (date: Date) => void;
};

export default function CalendarPicker({
  open,
  onClose,
  initial,
  onSelect,
}: CalendarPickerProps) {
  if (!open) return null;

  const calendar = useCalendar(initial);

  const {
    year,
    month,
    day,
    goPrevMonth,
    goNextMonth,
    selectDay,
    getDays,
    setCurrent,
  } = calendar;

  const today = new Date();
  const [desiredDay, setDesiredDay] = useState(initial.getDate());

  const [pickerMode, setPickerMode] = useState<"calendar" | "picker">(
    "calendar"
  );

  useEffect(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(desiredDay, daysInMonth);
    if (day !== safeDay) {
      selectDay(safeDay);
    }
  }, [year, month]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[var(--color-modal-bg)]" />

      <div
        className="relative bg-white rounded-2xl p-5 w-[90%] max-w-[380px] shadow-xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {pickerMode === "calendar" ? (
          <CalendarMode
            year={year}
            month={month}
            day={day}
            today={today}
            calendar={calendar}
            onClickYearMonth={() => setPickerMode("picker")}
            onSelect={() => onSelect(new Date(year, month, day))}
            setDesiredDay={setDesiredDay}
          />
        ) : (
          <PickerMode
            year={year}
            month={month}
            day={day}
            onChangeYear={(y) => setCurrent(new Date(y, month, day))}
            onChangeMonth={(m) => setCurrent(new Date(year, m - 1, day))}
            onConfirm={() => setPickerMode("calendar")}
          />
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.16s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

// CalendarMode Props 타입
type CalendarModeProps = {
  year: number;
  month: number;
  day: number;
  today: Date;
  calendar: ReturnType<typeof useCalendar>;
  onClickYearMonth: () => void;
  onSelect: () => void;
  setDesiredDay: (d: number) => void;
};

function CalendarMode({
  year,
  month,
  day,
  today,
  calendar,
  onClickYearMonth,
  onSelect,
  setDesiredDay,
}: CalendarModeProps) {
  const { goPrevMonth, goNextMonth, getDays, selectDay } = calendar;

  const handleSelect = (d: number) => {
    setDesiredDay(d);
    selectDay(d);
  };

  return (
    <>
      <CalendarHeader
        year={year}
        month={month}
        onPrev={goPrevMonth}
        onNext={goNextMonth}
        onClickYear={onClickYearMonth}
      />

      <CalendarGrid
        days={getDays()}
        selectedDay={day}
        today={today}
        currentYear={year}
        currentMonth={month}
        onSelect={handleSelect}
      />

      <button
        onClick={onSelect}
        className="mt-6 w-full py-3 rounded-xl bg-[var(--color-opu-light-green)] font-semibold cursor-pointer"
      >
        완료
      </button>
    </>
  );
}

// PickerMode Props 타입
type PickerModeProps = {
  year: number;
  month: number;
  day: number;
  onChangeYear: (y: number) => void;
  onChangeMonth: (m: number) => void;
  onConfirm: () => void;
};

function PickerMode({
  year,
  month,
  day,
  onChangeYear,
  onChangeMonth,
  onConfirm,
}: PickerModeProps) {
  const years = Array.from({ length: 46 }, (_, i) => 1990 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center text-[18px] font-semibold mb-4">
        연·월 선택
      </div>

      <div className="grid grid-cols-2 w-full gap-4 px-2 mb-4">
        <WheelPickerYearMonth
          items={years}
          value={year}
          onChange={onChangeYear}
          height={200}
          itemHeight={40}
        />

        <WheelPickerYearMonth
          items={months}
          value={month + 1}
          onChange={onChangeMonth}
          height={200}
          itemHeight={40}
        />
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-3 mt-4 rounded-xl bg-[var(--color-opu-light-green)] font-semibold cursor-pointer"
      >
        확인
      </button>
    </div>
  );
}
