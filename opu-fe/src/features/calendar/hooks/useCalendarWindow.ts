"use client";

import { useEffect, useState } from "react";
import type { CalendarDay } from "@/features/calendar/components/CalendarFull";
import { fetchMonthlyStatistics, fetchTodosByDate } from "@/features/todo/service";
import { buildCalendarMatrix } from "@/features/calendar/utils/buildCalendarMatrix";

/** 기존 useCalendarSlideMatrices 안에 있던 로직 그대로 */
async function buildFilledMatrix(
  year: number,
  month: number
): Promise<(CalendarDay | null)[][]> {
  const stats = await fetchMonthlyStatistics(year, month);

  const normalized = stats.map((s) => ({
    date: s.date,
    totalCount: s.totalCount,
    completedCount: s.completedCount,
  }));

  const baseMatrix = buildCalendarMatrix(normalized, year, month);

  const flatDays = baseMatrix.flat().filter(Boolean) as CalendarDay[];

  const todosList = await Promise.all(
    flatDays.map((d) => fetchTodosByDate(d.date))
  );

  let idx = 0;
  return baseMatrix.map((week) =>
    week.map((day) => {
      if (!day) return null;
      const filled = {
        ...day,
        todos: todosList[idx] ?? [],
      };
      idx++;
      return filled;
    })
  );
}

function addMonth(y: number, m: number, delta: number) {
  const d = new Date(y, m - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

type Window = {
  prev: (CalendarDay | null)[][];
  current: (CalendarDay | null)[][];
  next: (CalendarDay | null)[][];
};

export function useCalendarWindow(initYear: number, initMonth: number) {
  const [cursor, setCursor] = useState({ year: initYear, month: initMonth });
  const [window, setWindow] = useState<Window | null>(null);
  const [ready, setReady] = useState(false);

  /** 최초 로딩 */
  useEffect(() => {
    async function init() {
      setReady(false);

      const prev = addMonth(initYear, initMonth, -1);
      const next = addMonth(initYear, initMonth, 1);

      const [pm, cm, nm] = await Promise.all([
        buildFilledMatrix(prev.year, prev.month),
        buildFilledMatrix(initYear, initMonth),
        buildFilledMatrix(next.year, next.month),
      ]);

      setWindow({ prev: pm, current: cm, next: nm });
      setCursor({ year: initYear, month: initMonth });
      setReady(true);
    }

    init();
  }, []);

  /** ▶ 다음 달 */
  const slideNext = async () => {
    if (!window) return;

    const nextCursor = addMonth(cursor.year, cursor.month, 1);

    // 화면 즉시 전환
    setWindow((w) => ({
      prev: w!.current,
      current: w!.next,
      next: w!.next, // 임시
    }));

    // 새로운 next 채우기
    const afterNext = addMonth(nextCursor.year, nextCursor.month, 1);
    const newNext = await buildFilledMatrix(
      afterNext.year,
      afterNext.month
    );

    setWindow((w) => ({ ...w!, next: newNext }));
    setCursor(nextCursor);
  };

  /** ◀ 이전 달 */
  const slidePrev = async () => {
    if (!window) return;

    const prevCursor = addMonth(cursor.year, cursor.month, -1);

    setWindow((w) => ({
      prev: w!.prev,
      current: w!.prev,
      next: w!.current,
    }));

    const beforePrev = addMonth(prevCursor.year, prevCursor.month, -1);
    const newPrev = await buildFilledMatrix(
      beforePrev.year,
      beforePrev.month
    );

    setWindow((w) => ({ ...w!, prev: newPrev }));
    setCursor(prevCursor);
  };

  /** 헤더에서 월 점프 */
  const jumpTo = async (year: number, month: number) => {
    if (!window) return;

    const curY = cursor.year;
    const curM = cursor.month;

    // ▶ 다음 달 클릭
    if (
        year === curY &&
        month === curM + 1
    ) {
        slideNext();
        return;
    }

    // ◀ 이전 달 클릭
    if (
        year === curY &&
        month === curM - 1
    ) {
        slidePrev();
        return;
    }

    // 🔹 먼 달 점프 (optimistic)
    setCursor({ year, month });

    // 화면은 즉시 바꿈 (current만 우선)
    setWindow((w) => ({
        prev: w!.prev,
        current: w!.current,
        next: w!.next,
    }));

    // 뒤에서 실제 데이터 채움
    const prev = addMonth(year, month, -1);
    const next = addMonth(year, month, 1);

    const [pm, cm, nm] = await Promise.all([
        buildFilledMatrix(prev.year, prev.month),
        buildFilledMatrix(year, month),
        buildFilledMatrix(next.year, next.month),
    ]);

    setWindow({ prev: pm, current: cm, next: nm });
    };

  return {
    window,
    cursor,
    ready,
    slideNext,
    slidePrev,
    jumpTo,
  };
}
