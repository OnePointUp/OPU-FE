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

  const getIndexFromScroll = () =>
    Math.round((ref.current?.scrollTop ?? 0) / itemHeight);

  const scrollToIndex = (idx: number, smooth = true) => {
    ref.current?.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    const baseIdx = items.indexOf(value);
    if (baseIdx === -1) return;
    const target = enableInfinite ? baseIdx + middleOffset : baseIdx;
    scrollToIndex(target, false);
  }, [value, items]);

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

  /** wheel로 정확히 1칸 이동 */
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
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
      onWheel={onWheel}
    >
      <div
        className="absolute left-2 right-2 pointer-events-none rounded-lg z-0"
        style={{
          height: itemHeight,
          top: height / 2 - itemHeight / 2, // 중앙 정렬
        }}
      />

      {/* 스크롤 영역 */}
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          height,
          paddingTop: padding,
          paddingBottom: padding,
          overflowY: "hidden", // 스크롤바 완전 차단
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
