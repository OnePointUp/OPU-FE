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
 */
export function useCalendarLayout(weekCount: number) {
  const daySelectorRef = useRef<HTMLDivElement>(null);

  const [cellHeight, setCellHeight] = useState(90);
  const [expandedHeight, setExpandedHeight] = useState(90);
  const [collapsedHeight, setCollapsedHeight] = useState(45);
  const [todoHeight, setTodoHeight] = useState(0);

  /** 캘린더 행 수(weekCount)에 따라 셀 높이 재계산 */
  const recalcHeights = () => {
    if (!weekCount) return;

    const vh = window.innerHeight;
    const daySelectorH =
      daySelectorRef.current?.offsetHeight ?? DEFAULT_DAY_SELECTOR_HEIGHT;

    const remained =
      vh - daySelectorH - BOTTOM_NAV_HEIGHT - PLUS_BUTTON_SPACE - TOP_PADDING;

    const newCellHeight = Math.max(
      CELL_MIN_HEIGHT,
      Math.min(remained / weekCount, CELL_MAX_HEIGHT)
    );

    setExpandedHeight(newCellHeight);
    setCollapsedHeight(newCellHeight * 0.40);

    /*
     *  weekCount가 바뀔 때마다 cellHeight를 강제 재계산하여
     *  5주 → 6주 변경 시 달력이 Todo와 겹치는 문제 방지.
     */
    setCellHeight(newCellHeight);
  };

  /** 화면 사이즈 변경 시 재계산 */
  useEffect(() => {
    recalcHeights();
    window.addEventListener("resize", recalcHeights);
    return () => window.removeEventListener("resize", recalcHeights);
  }, [weekCount]);

  /** TodoList 높이 계산 */
  useEffect(() => {
    if (!weekCount || !daySelectorRef.current) return;

    const vh = window.innerHeight;
    const daySelectorH = daySelectorRef.current.offsetHeight;
    const calendarHeight = cellHeight * weekCount + CALENDAR_BOTTOM_MARGIN;

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
    todoHeight
  };
}
