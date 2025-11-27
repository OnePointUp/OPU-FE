"use client";

import { useLayoutEffect, useEffect, useRef } from "react";

type WheelPickerBaseProps<T extends string | number> = {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
  height?: number;
  itemHeight?: number;
  isItemDisabled?: (v: T) => boolean;
  enableInfinite?: boolean;
};

export default function WheelPickerBase<T extends string | number>({
  items,
  value,
  onChange,
  height = 180,
  itemHeight = 42,
  isItemDisabled = () => false,
  enableInfinite = true,
}: WheelPickerBaseProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const prevItemsRef = useRef(items);

  const padding = (height - itemHeight) / 2;

  // enableInfinite 여부에 따라 확장 배열 지정
  const extended = enableInfinite
    ? ([...items, ...items, ...items] as T[])
    : ([...items] as T[]);

  const middleOffset = enableInfinite ? items.length : 0;

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
    return enableInfinite ? idx + middleOffset : idx;
  };

  // value가 items에 포함되지 않으면 보정
  useEffect(() => {
    if (!items.includes(value)) {
      onChange(items[items.length - 1]);
    }
  }, [items, value]);

  // items 변경 시 scroll 튐 방지
  useLayoutEffect(() => {
    const prev = prevItemsRef.current;
    const curr = items;

    if (prev.length !== curr.length) {
      const el = ref.current;
      if (!el) return;

      el.style.scrollSnapType = "none";
      el.style.scrollBehavior = "auto";

      const idx = getExtendedIndexForValue();
      el.scrollTop = idx * itemHeight;

      requestAnimationFrame(() => {
        el.style.scrollSnapType = "y mandatory";
        el.style.scrollBehavior = "smooth";
      });
    }

    prevItemsRef.current = curr;
  }, [items]);

  // value 변경 시 자동 스크롤 이동
  useEffect(() => {
    scrollToIndex(getExtendedIndexForValue(), true);
  }, [value]);

  // wheel 스크롤
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;
      const currIndex = getIndexFromScroll();
      const nextIndex = currIndex + dir;

      scrollToIndex(nextIndex, true);

      let realIndex: number;

      if (enableInfinite) {
        realIndex =
          ((nextIndex % items.length) + items.length) % items.length;
      } else {
        // finite 모드에서는 index 범위 고정
        realIndex = Math.min(
          Math.max(nextIndex, 0),
          items.length - 1
        );
      }

      const selected = items[realIndex];

      if (!isItemDisabled(selected)) {
        onChange(selected);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [items, value, enableInfinite]);

  // 터치/드래그 스크롤에서도 선택 반영
  let scrollTimeout: any;

  const onScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const el = ref.current;
      if (!el) return;

      // 무한 모드일 경우: 앵커 처리 + index 계산
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

        const idx = getIndexFromScroll();
        const real =
          ((idx % items.length) + items.length) % items.length;

        const selected = items[real];

        if (!isItemDisabled(selected) && selected !== value) {
          onChange(selected);
        }
      } else {
        // finite 모드일 경우: 그냥 가운데 index를 선택 값으로
        const idx = getIndexFromScroll();
        const clamped = Math.min(
          Math.max(idx, 0),
          items.length - 1
        );
        const selected = items[clamped];

        if (!isItemDisabled(selected) && selected !== value) {
          onChange(selected);
        }
      }
    }, 30);
  };

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* 상단/하단 그라데이션 */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* 중앙 선택 영역 */}
      <div
        className="absolute left-0 right-0 border-y border-gray-300 pointer-events-none"
        style={{
          height: itemHeight,
          top: height / 2 - itemHeight / 2,
        }}
      />

      {/* 스크롤 영역 */}
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
