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
  height = 120,
  itemHeight = 40,
  enableInfinite = true,
}: WheelPickerBaseProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const padding = (height - itemHeight) / 2;

  const extended = enableInfinite
    ? [...items, ...items, ...items]
    : [...items];

  const middleOffset = enableInfinite ? items.length : 0;

  /** 현재 인덱스 구하기 */
  const getIndexFromScroll = () =>
    Math.round((ref.current?.scrollTop ?? 0) / itemHeight);

  /** 특정 인덱스로 이동 */
  const scrollToIndex = (idx: number, smooth = true) => {
    ref.current?.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  /** value 변경 시 스크롤 위치 맞추기 */
  useEffect(() => {
    const baseIdx = items.indexOf(value);
    if (baseIdx === -1) return;
    const target = enableInfinite ? baseIdx + middleOffset : baseIdx;
    scrollToIndex(target, false);
  }, [value, items]);

  /** scroll 처리 (snap 및 infinite 유지) */
  const scrollTimeoutRef = useRef<number | null>(null);

  const onScroll = () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;

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
        : Math.max(0, Math.min(items.length - 1, idx));

      const nextValue = items[realIdx];
      if (nextValue !== value) onChange(nextValue);
    }, 70);
  };

  /** 🎯 핵심: wheel 이벤트를 scroll div 에 직접 걸어야 "1칸 이동"이 제대로 동작함 */
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();     // 기본 스크롤 완전 차단
    e.stopPropagation();

    const currentIdx = getIndexFromScroll();
    const direction = e.deltaY > 0 ? 1 : -1;

    let nextIdx = currentIdx + direction;

    if (!enableInfinite) {
      nextIdx = Math.max(0, Math.min(items.length - 1, nextIdx));
    }

    scrollToIndex(nextIdx);
  };

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        height,
        maskImage:
          "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
      }}
    >
      {/* 중앙 선택 라인 */}
      <div
        className="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-[40px] 
                   rounded-lg pointer-events-none z-0"
      />

      {/* scroll 영역 */}
      <div
        ref={ref}
        onScroll={onScroll}
        onWheel={onWheel}
        style={{
          height,
          paddingTop: padding,
          paddingBottom: padding,
          overflowY: "hidden",
          scrollSnapType: "y mandatory",
        }}
        className="[&::-webkit-scrollbar]:hidden relative z-10"
      >
        {extended.map((item, idx) => {
          const active = item === value;

          return (
            <div
              key={idx}
              className={`flex items-center justify-center transition-all cursor-pointer
                ${
                  active
                    ? "opacity-100 scale-110 text-black font-medium text-[16px]"
                    : "opacity-40 scale-95 text-gray-400 text-[16px]"
                }
              `}
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
