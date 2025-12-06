"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  cellHeight: number;
  setCellHeight: React.Dispatch<React.SetStateAction<number>>;
  expandedHeight: number;
  collapsedHeight: number;
  onSwipePrevMonth: () => void;
  onSwipeNextMonth: () => void;
};

const DRAG_SPEED = 0.4;
const SWIPE_THRESHOLD = 50;

export default function CalendarContainer({
  children,
  cellHeight,
  setCellHeight,
  expandedHeight,
  collapsedHeight,
  onSwipePrevMonth,
  onSwipeNextMonth,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const startY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const isVertical = useRef<boolean | null>(null);

  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMouseDown = useRef(false);

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

  const triggerMonthChange = (dir: "prev" | "next") => {
    setIsAnimating(true);
    setTranslateX(dir === "next" ? -window.innerWidth : window.innerWidth);

    setTimeout(() => {
      if (dir === "next") onSwipeNextMonth();
      else onSwipePrevMonth();

      setTranslateX(dir === "next" ? window.innerWidth : -window.innerWidth);

      setTimeout(() => {
        setTranslateX(0);
        setTimeout(() => setIsAnimating(false), 300);
      }, 50);
    }, 200);
  };

  const handleStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startY.current = t.clientY;
    startX.current = t.clientX;
    isVertical.current = null;
  };

  const handleMove = (e: React.TouchEvent) => {
    if (isAnimating) return;

    const t = e.touches[0];
    if (startX.current == null || startY.current == null) return;

    const deltaX = t.clientX - startX.current;
    const deltaY = t.clientY - startY.current;

    if (isVertical.current === null) {
      isVertical.current = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (!isVertical.current) {
      e.preventDefault();
      setTranslateX(deltaX);
      return;
    }

    const swipeY = startY.current - t.clientY;

    if (swipeY > 0) {
      setCellHeight((prev) =>
        Math.max(collapsedHeight, prev - swipeY * DRAG_SPEED)
      );
    } else {
      setCellHeight((prev) =>
        Math.min(expandedHeight, prev - swipeY * DRAG_SPEED)
      );
    }
  };

  const handleEnd = (e: React.TouchEvent) => {
    if (isAnimating) return;

    const t = e.changedTouches[0];
    const deltaX = t.clientX - (startX.current ?? 0);

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      triggerMonthChange(deltaX < 0 ? "next" : "prev");
    } else {
      setTranslateX(0);
    }

    startX.current = null;
    startY.current = null;
    isVertical.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || isAnimating) return;
    const deltaX = e.clientX - (startX.current ?? 0);
    setTranslateX(deltaX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;

    const deltaX = e.clientX - (startX.current ?? 0);

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      triggerMonthChange(deltaX < 0 ? "next" : "prev");
    } else {
      setTranslateX(0);
    }

    startX.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="transition-[height] duration-200 w-full overflow-hidden"
      style={{
        height: cellHeight * 6 + 40,
      }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isAnimating ? "transform 0.25s ease" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
