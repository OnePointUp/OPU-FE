"use client";

import { useEffect, useRef } from "react";

type WheelPickerProps = {
  items: (string | number)[];
  value: string | number;
  onChange: (v: string | number) => void;
  height?: number;
  itemHeight?: number;
};

export default function WheelPicker({
  items,
  value,
  onChange,
  height = 180,
  itemHeight = 42,
}: WheelPickerProps) {

  const ref = useRef<HTMLDivElement>(null);
  const padding = (height - itemHeight) / 2;

  // 현재 스크롤 위치 → index 변환
  const getIndexFromScroll = () => {
    if (!ref.current) return 0;
    return Math.round(ref.current.scrollTop / itemHeight);
  };

  // value 변경 → 해당 위치로 스크롤
  const scrollToValue = (smooth = true) => {
    const idx = items.indexOf(value);
    if (idx === -1 || !ref.current) return;

    ref.current.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // 초기값 & 외부 value 변경 시 적용
  useEffect(() => {
    scrollToValue(false);
  }, []);

  useEffect(() => {
    scrollToValue(true);
  }, [value, items]);

  // 스크롤 시 onChange
  let scrollTimeout: any;

  const onScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const idx = getIndexFromScroll();
      const selected = items[idx];
      if (selected !== undefined && selected !== value) {
        onChange(selected);
      }
    }, 70);
  };

  // 마우스 휠 → 한 칸씩만 이동
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;
      const currIndex = getIndexFromScroll();

      let nextIndex = currIndex + dir;
      nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex));

      const nextValue = items[nextIndex];
      if (nextValue !== undefined) {
        onChange(nextValue);
      }

      el.scrollTo({
        top: nextIndex * itemHeight,
        behavior: "smooth",
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [items, value]);

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-14 z-20 
                      bg-gradient-to-b from-white to-transparent" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 z-20 
                      bg-gradient-to-t from-white to-transparent" />

      {/* Center selection line */}
      <div
        className="pointer-events-none absolute left-0 right-0 z-10 border-y border-gray-300"
        style={{
          height: itemHeight,
          top: height / 2 - itemHeight / 2,
        }}
      />

      {/* Scrollable list */}
      <div
        ref={ref}
        data-no-drag
        onScroll={onScroll}
        style={{
          height,
          paddingTop: padding,
          paddingBottom: padding,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <div
            key={`${idx}-${item}`}
            className={`
              flex items-center justify-center
              transition-all duration-150
              ${
                item === value
                  ? "font-semibold text-black text-[20px]"
                  : "text-gray-400 text-[17px]"
              }
            `}
            style={{
              height: itemHeight,
              scrollSnapAlign: "center",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
