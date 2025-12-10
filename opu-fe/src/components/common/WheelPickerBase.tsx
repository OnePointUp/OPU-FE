"use client";

import { useEffect, useRef } from "react";

type WheelPickerBaseProps<T extends string | number> = {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
  height?: number;
  itemHeight?: number;
  enableInfinite?: boolean;
};

export default function WheelPickerBase<T extends string | number>({
  items,
  value,
  onChange,
  height = 180,
  itemHeight = 42,
  enableInfinite = true,
}: WheelPickerBaseProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const padding = (height - itemHeight) / 2;

  const extended = enableInfinite
    ? [...items, ...items, ...items]
    : [...items];

  const middleOffset = enableInfinite ? items.length : 0;

  /** 스크롤 → 인덱스 변환 */
  const getIndexFromScroll = () =>
    Math.round((ref.current?.scrollTop ?? 0) / itemHeight);

  /** 인덱스 → 스크롤 이동 */
  const scrollToIndex = (idx: number, smooth = true) => {
    ref.current?.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  /** value 변경 → 위치 이동 */
  useEffect(() => {
    const baseIdx = items.indexOf(value);
    if (baseIdx === -1) return;

    const target = enableInfinite ? baseIdx + middleOffset : baseIdx;
    scrollToIndex(target, true);
  }, [value, items]);

  /** 스크롤 타이머 ref (number 타입 명시) */
  const scrollTimeoutRef = useRef<number | null>(null);

  /** 스크롤 이벤트 */
  const onScroll = () => {
    if (scrollTimeoutRef.current !== null) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;

      // 무한 스크롤 유지
      if (enableInfinite) {
        const block = items.length * itemHeight;
        const curr = el.scrollTop;

        if (curr < block) {
          el.style.scrollBehavior = "auto";
          el.scrollTop = curr + block;
          el.style.scrollBehavior = "smooth";
        } else if (curr >= block * 2) {
          el.style.scrollBehavior = "auto";
          el.scrollTop = curr - block;
          el.style.scrollBehavior = "smooth";
        }
      }

      const idx = getIndexFromScroll();

      const realIdx = enableInfinite
        ? ((idx % items.length) + items.length) % items.length
        : Math.min(Math.max(idx, 0), items.length - 1);

      const selectedValue = items[realIdx];

      if (selectedValue !== value) {
        onChange(selectedValue);
      }
    }, 80);
  };

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* 선택 영역 */}
      <div
        className="absolute left-0 right-0 border-y border-gray-300 pointer-events-none"
        style={{
          height: itemHeight,
          top: height / 2 - itemHeight / 2,
        }}
      />

      {/* 실제 스크롤 */}
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          height,
          paddingTop: padding,
          paddingBottom: padding,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {extended.map((item, idx) => {
          const active = item === value;

          return (
            <div
              key={idx}
              className={`flex items-center justify-center transition-all duration-150 ${
                active
                  ? "text-black font-semibold text-[20px]"
                  : "text-gray-400 text-[17px]"
              }`}
              style={{
                height: itemHeight,
                scrollSnapAlign: "center",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
