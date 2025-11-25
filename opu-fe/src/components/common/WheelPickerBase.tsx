"use client";

import { useLayoutEffect, useEffect, useRef } from "react";

type WheelPickerBaseProps = {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  height?: number;
  itemHeight?: number;
  isItemDisabled?: (v: number) => boolean;
};

export default function WheelPickerBase({
  items,
  value,
  onChange,
  height = 180,
  itemHeight = 42,
  isItemDisabled = () => false,
}: WheelPickerBaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prevItemsRef = useRef(items);

  const padding = (height - itemHeight) / 2;
  const extended = [...items, ...items, ...items];
  const middleOffset = items.length;

  const getIndexFromScroll = () =>
    Math.round((ref.current?.scrollTop ?? 0) / itemHeight);

  const scrollToIndex = (idx: number, smooth = true) => {
    ref.current?.scrollTo({
      top: idx * itemHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const getExtendedIndexForValue = () => {
    const idx = items.indexOf(value);
    return idx + middleOffset;
  };

  // -------------------------------------------
  // 0) value가 items 범위 바깥이면 즉시 보정
  // -------------------------------------------
  useEffect(() => {
    if (!items.includes(value)) {
      const last = items[items.length - 1];
      onChange(last);
    }
  }, [items, value]);

  // -------------------------------------------
  // 1) items 변경 시 scrollTop 튐 제거 (layoutEffect)
  // -------------------------------------------
  useLayoutEffect(() => {
    const prev = prevItemsRef.current;
    const curr = items;

    if (prev.length !== curr.length) {
      const el = ref.current;
      if (!el) return;

      // 스냅, 애니메이션 즉시 제거
      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";

      const idx = getExtendedIndexForValue();
      el.scrollTop = idx * itemHeight; // 즉시 위치 복원

      // 다음 프레임에서 스냅 복구
      requestAnimationFrame(() => {
        el.style.scrollSnapType = "y mandatory";
        el.style.scrollBehavior = "smooth";
      });
    }

    prevItemsRef.current = curr;
  }, [items]);

  // -------------------------------------------
  // 2) value 변경 → 자연스러운 smooth 이동
  // -------------------------------------------
  useEffect(() => {
    scrollToIndex(getExtendedIndexForValue(), true);
  }, [value]);

  // -------------------------------------------
  // 3) wheel 스크롤 (항상 1칸씩)
  // -------------------------------------------
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;
      const currIndex = getIndexFromScroll();
      const nextIndex = currIndex + dir;

      scrollToIndex(nextIndex, true);

      const real =
        ((nextIndex % items.length) + items.length) % items.length;

      const selected = items[real];

      if (!isItemDisabled(selected)) {
        onChange(selected);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [items, value]);

  // -------------------------------------------
  // 4) infinite scroll
  // -------------------------------------------
  let scrollTimeout: any;

  const onScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const el = ref.current;
      if (!el) return;

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

      const idx = getIndexFromScroll();
      const real =
        ((idx % items.length) + items.length) % items.length;

      const selected = items[real];

      if (!isItemDisabled(selected) && selected !== value) {
        onChange(selected);
      }
    }, 30);
  };

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div
        className="absolute left-0 right-0 border-y border-gray-300 pointer-events-none"
        style={{
          height: itemHeight,
          top: height / 2 - itemHeight / 2,
        }}
      />

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
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {extended.map((item, idx) => {
          const disabled = isItemDisabled(item);
          const active = !disabled && item === value;

          return (
            <div
              key={idx}
              className={`flex items-center justify-center transition-all duration-150 ${
                disabled
                  ? "text-transparent"
                  : active
                  ? "text-black font-semibold text-[20px]"
                  : "text-gray-400 text-[17px]"
              }`}
              style={{
                height: itemHeight,
                scrollSnapAlign: "center",
                pointerEvents: disabled ? "none" : "auto",
              }}
            >
              {disabled ? "" : item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
