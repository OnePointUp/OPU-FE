"use client";

import { useEffect, useRef, useState } from "react";
import type { GestureLock } from "../pages/CalendarPage";

type Props = {
  prev: React.ReactNode;
  current: React.ReactNode;
  next: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  gestureLock: GestureLock;
  setGestureLock: React.Dispatch<React.SetStateAction<GestureLock>>;
};

const SWIPE_THRESHOLD = 50;
const SLIDE_DURATION = 250;

export default function CalendarSlider({
  prev,
  current,
  next,
  onPrev,
  onNext,
  gestureLock,
  setGestureLock,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const [translateX, setTranslateX] = useState(0);
  const [width, setWidth] = useState(0);
  const [animating, setAnimating] = useState(false);

  /** width 측정 */
  useEffect(() => {
    if (!wrapperRef.current) return;

    const resize = () => {
      const w = wrapperRef.current!.offsetWidth;
      setWidth(w);
      setTranslateX(-w);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /** 드래그 시작 */
  const beginDrag = (clientX: number) => {
    if (gestureLock !== "none" || animating) return;

    setGestureLock("horizontal");
    startX.current = clientX;
    isDragging.current = true;
  };

  /** 드래그 이동 */
  const moveDrag = (clientX: number) => {
    if (!isDragging.current || animating) return;

    const delta = clientX - (startX.current ?? 0);
    setTranslateX(-width + delta);
  };

  /** 드래그 종료 */
  const endDrag = (clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const delta = clientX - (startX.current ?? 0);

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      setAnimating(true);

      if (delta < 0) {
        setTranslateX(-width * 2);
        setTimeout(() => {
          onNext();
          setTranslateX(-width);
          setAnimating(false);
          setGestureLock("none");
        }, SLIDE_DURATION);
      } else {
        setTranslateX(0);
        setTimeout(() => {
          onPrev();
          setTranslateX(-width);
          setAnimating(false);
          setGestureLock("none");
        }, SLIDE_DURATION);
      }
    } else {
      setTranslateX(-width);
      setGestureLock("none");
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full overflow-hidden"
      onMouseDown={(e) => beginDrag(e.clientX)}
      onMouseMove={(e) => isDragging.current && moveDrag(e.clientX)}
      onMouseUp={(e) => endDrag(e.clientX)}
      onMouseLeave={(e) => isDragging.current && endDrag(e.clientX)}
      onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
      style={{
        cursor:
          gestureLock === "horizontal"
            ? "grabbing"
            : "grab",
        pointerEvents:
          gestureLock === "vertical" ? "none" : "auto",
      }}
    >
      {width > 0 && (
        <div
          className="flex h-full"
          style={{
            width: width * 3,
            transform: `translateX(${translateX}px)`,
            transition: animating
              ? `transform ${SLIDE_DURATION}ms ease`
              : "none",
          }}
        >
          <div style={{ width }}>{prev}</div>
          <div style={{ width }}>{current}</div>
          <div style={{ width }}>{next}</div>
        </div>
      )}
    </div>
  );
}
