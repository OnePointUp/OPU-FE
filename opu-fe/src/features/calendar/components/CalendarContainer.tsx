"use client";

import { useEffect, useRef } from "react";
import type { GestureLock } from "../pages/CalendarPage";

type Props = {
  children: React.ReactNode;
  weekCount: number;
  cellHeight: number;
  setCellHeight: React.Dispatch<React.SetStateAction<number>>;
  expandedHeight: number;
  collapsedHeight: number;
  gestureLock: GestureLock;
  setGestureLock: React.Dispatch<React.SetStateAction<GestureLock>>;
};

const DRAG_SPEED = 0.4;

export default function CalendarContainer({
  children,
  weekCount,
  cellHeight,
  setCellHeight,
  expandedHeight,
  collapsedHeight,
  gestureLock,
  setGestureLock,
}: Props) {
  const startY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /** wheel 이벤트 */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (gestureLock === "horizontal") return;

      e.preventDefault();
      setGestureLock("vertical");

      setCellHeight(e.deltaY > 0 ? collapsedHeight : expandedHeight);

      setTimeout(() => {
        setGestureLock("none");
      }, 200);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [expandedHeight, collapsedHeight, setCellHeight, gestureLock, setGestureLock]);

  /** 터치 스와이프 */
  const handleStart = (e: React.TouchEvent) => {
    if (gestureLock !== "none") return;

    setGestureLock("vertical");
    startY.current = e.touches[0].clientY;
  };

  const handleMove = (e: React.TouchEvent) => {
    if (startY.current == null || gestureLock !== "vertical") return;

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
    if (gestureLock !== "vertical") return;

    const mid = (expandedHeight + collapsedHeight) / 2;
    setCellHeight(cellHeight < mid ? collapsedHeight : expandedHeight);

    startY.current = null;
    setGestureLock("none");
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className="transition-[height] duration-200 w-full overflow-hidden"
      style={{
        height: (weekCount + 1) * cellHeight + 50,
      }}
    >
      {children}
    </div>
  );
}
