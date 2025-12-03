"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_DAY_SELECTOR_HEIGHT,
  BOTTOM_NAV_HEIGHT,
  PLUS_BUTTON_SPACE,
  TOP_PADDING,
  CELL_MIN_HEIGHT,
  CELL_MAX_HEIGHT,
  CALENDAR_BOTTOM_MARGIN,
  MENU_HEIGHT,
  PLUS_BUTTON_AREA,
  SAFE_PADDING,
} from "../layout/height";

/**
 * 캘린더/투두 레이아웃(높이) 담당 훅
 *
 * - DaySelector 높이 측정
 * - 캘린더 셀 높이 계산 (expanded / collapsed)
 * - TodoList 영역 높이 계산
 * - 화면 리사이즈 대응
 */
export function useCalendarLayout(weekCount: number) {
  const daySelectorRef = useRef<HTMLDivElement>(null);

  const [cellHeight, setCellHeight] = useState(90);
  const [expandedHeight, setExpandedHeight] = useState(90);
  const [collapsedHeight, setCollapsedHeight] = useState(45);
  const [todoHeight, setTodoHeight] = useState(0);

  /** 캘린더 셀 높이 계산 함수 */
  const calculateCellHeight = () => {
    if (!weekCount) return;

    const vh = window.innerHeight;
    const daySelectorH =
      daySelectorRef.current?.offsetHeight ?? DEFAULT_DAY_SELECTOR_HEIGHT;

    const remained =
      vh - daySelectorH - BOTTOM_NAV_HEIGHT - PLUS_BUTTON_SPACE - TOP_PADDING;

    const newCellHeight = remained / weekCount;
    const finalH = Math.max(
      CELL_MIN_HEIGHT,
      Math.min(newCellHeight, CELL_MAX_HEIGHT)
    );

    setExpandedHeight(finalH);
    setCollapsedHeight(finalH * 0.55);

    // 셀 높이 리셋 조건:
    // 1) 초기값일 때 (cellHeight = 90 → 설정 필요)
    // 2) 이미 fully-expanded 상태일 때 (확장/드래그 안 한 상태)
    // 3) collapse된 상태면 유지
    setCellHeight((prev) => {
      const isInitial = prev === 90;
      const isExpanded = prev >= expandedHeight * 0.95;

      if (isInitial || isExpanded) return finalH;
      return prev; // collapse 상태는 유지
    });
  };

  /** 캘린더 셀 높이 계산 + 리사이즈 반영 */
  useEffect(() => {
    calculateCellHeight();
    window.addEventListener("resize", calculateCellHeight);
    return () => window.removeEventListener("resize", calculateCellHeight);
  }, [weekCount]);

  /** TodoList 영역 높이 계산 */
  useEffect(() => {
    if (!weekCount) return;
    if (!daySelectorRef.current) return;

    const vh = window.innerHeight;
    const daySelectorH = daySelectorRef.current.offsetHeight;

    const calendarHeight =
      cellHeight * weekCount + CALENDAR_BOTTOM_MARGIN;

    const available =
      vh -
      daySelectorH -
      calendarHeight -
      MENU_HEIGHT -
      PLUS_BUTTON_AREA -
      SAFE_PADDING;

    setTodoHeight(Math.max(0, available));
  }, [cellHeight, weekCount]);

  return {
    daySelectorRef,
    cellHeight,
    setCellHeight,
    expandedHeight,
    collapsedHeight,
    todoHeight,
  };
}
