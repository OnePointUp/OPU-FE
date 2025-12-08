"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  weekCount: number;
  cellHeight: number;
  setCellHeight: React.Dispatch<React.SetStateAction<number>>;
  expandedHeight: number;
  collapsedHeight: number;
};

const DRAG_SPEED = 0.4;

export default function CalendarContainer({
  children,
  weekCount,
  cellHeight,
  setCellHeight,
  expandedHeight,
  collapsedHeight,
}: Props) {
  const startY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** wheel 이벤트 */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) setCellHeight(collapsedHeight);
      else setCellHeight(expandedHeight);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [expandedHeight, collapsedHeight, setCellHeight]);

  const handleStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleMove = (e: React.TouchEvent) => {
    if (!startY.current) return;
    e.preventDefault();

    const delta = startY.current - e.touches[0].clientY;

    if (delta > 0) {
      setCellHeight((prev) =>
        Math.max(collapsedHeight, prev - delta * DRAG_SPEED)
      );
    } else {
      setCellHeight((prev) =>
        Math.min(expandedHeight, prev - delta * DRAG_SPEED)
      );
    }
  };

  const handleEnd = () => {
    const mid = (expandedHeight + collapsedHeight) / 2;
    if (cellHeight < mid) setCellHeight(collapsedHeight);
    else setCellHeight(expandedHeight);
    startY.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className="transition-[height] duration-200 w-full"
      style={{
        height: cellHeight * (weekCount + 1) + 50,
      }}
    >
      {children}
    </div>
  );
}
