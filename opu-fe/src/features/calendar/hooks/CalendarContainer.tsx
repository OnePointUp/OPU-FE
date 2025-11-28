"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  calendarMatrix: any[][];
  cellHeight: number;
  setCellHeight: (n: number) => void;

  /** MainPage에게 계산된 높이 전달 */
  setExpandedHeight: (n: number) => void;
  setCollapsedHeight: (n: number) => void;
  expandedHeight: number;
  collapsedHeight: number;
};

const DRAG_SPEED = 0.4;

export default function CalendarContainer({
  children,
  calendarMatrix,
  cellHeight,
  setCellHeight,
  expandedHeight,
  collapsedHeight,
  setExpandedHeight,
  setCollapsedHeight,
}: Props) {
  const startY = useRef<number | null>(null);
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    if (calendarMatrix.length === 0) return;

    const vh = window.innerHeight;
    const weekCount = calendarMatrix.length;

    const weekdayArea = 40;
    const margin = 40;
    const reservedTodo = 200;

    const dynamicHeight =
      (vh - weekdayArea - margin - reservedTodo) / weekCount;

    const finalHeight = Math.max(75, Math.min(dynamicHeight, 130));

    setExpandedHeight(finalHeight);
    setCollapsedHeight(finalHeight * 0.5);
    setCellHeight(finalHeight);

    initialized.current = true; // 한 번만 실행됨
  }, [calendarMatrix.length]);

  /** 터치 시작 */
  const handleStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  /** 터치 이동 */
  const handleMove = (e: React.TouchEvent) => {
    if (startY.current == null) return;

    const delta = startY.current - e.touches[0].clientY;

    if (delta > 0) {
      // 위 → 접힘
      const next = Math.max(collapsedHeight, cellHeight - delta * DRAG_SPEED);
      setCellHeight(next);
    } else {
      // 아래 → 펼침
      const next = Math.min(expandedHeight, cellHeight - delta * DRAG_SPEED);
      setCellHeight(next);
    }
  };

  /** 터치 종료 */
  const handleEnd = () => {
    const mid = (expandedHeight + collapsedHeight) / 2;

    if (cellHeight < mid) setCellHeight(collapsedHeight);
    else setCellHeight(expandedHeight);

    startY.current = null;
  };

  return (
    <div
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className="transition-[height] duration-200 w-full"
      style={{
        height: calendarMatrix.length
          ? cellHeight * calendarMatrix.length + 60
          : 0,
      }}
    >
      {children}
    </div>
  );
}
