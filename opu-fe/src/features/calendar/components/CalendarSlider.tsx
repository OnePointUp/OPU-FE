"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  prev: React.ReactNode;
  current: React.ReactNode;
  next: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
};

const SWIPE_THRESHOLD = 50;

export default function CalendarSlider({
  prev,
  current,
  next,
  onPrev,
  onNext,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const [translateX, setTranslateX] = useState(0);
  const [width, setWidth] = useState(0);
  const [animating, setAnimating] = useState(false);

  /** ✔ 부모 컨테이너 width 측정 */
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

  /** 공통: 드래그 시작 */
  const beginDrag = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
  };

  /** 공통: 드래그 이동 */
  const moveDrag = (clientX: number) => {
    if (!isDragging.current || animating) return;

    const delta = clientX - (startX.current ?? 0);
    setTranslateX(-width + delta);
  };

  /** 공통: 드래그 종료 */
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
        }, 250);
      } else {
        setTranslateX(0);
        setTimeout(() => {
          onPrev();
          setTranslateX(-width);
          setAnimating(false);
        }, 250);
      }
    } else {
      setTranslateX(-width);
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

      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
    >
      {width > 0 && (
        <div
          className="flex h-full"
          style={{
            width: width * 3,
            transform: `translateX(${translateX}px)`,
            transition: animating ? "transform .25s ease" : "none",
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
