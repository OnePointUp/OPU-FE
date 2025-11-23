"use client";

import { useState } from "react";

export function useCalendar(initialDate = new Date()) {
  const [current, setCurrent] = useState(initialDate);

  const year = current.getFullYear();
  const month = current.getMonth(); // 0~11
  const day = current.getDate();

  const goPrevMonth = () => {
    setCurrent(new Date(year, month - 1, 1));
  };

  const goNextMonth = () => {
    setCurrent(new Date(year, month + 1, 1));
  };

  const selectDay = (d: number) => {
    setCurrent(new Date(year, month, d));
  };

  const getDays = () => {
    const firstDay = new Date(year, month, 1).getDay(); // 0일~6토
    const lastDate = new Date(year, month + 1, 0).getDate();

    const prevLast = new Date(year, month, 0).getDate();

    const days = [];

    // 이전 달
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevLast - i,
        currentMonth: false,
      });
    }

    // 이번 달
    for (let d = 1; d <= lastDate; d++) {
      days.push({
        day: d,
        currentMonth: true,
      });
    }

    // 다음 달
    const nextCount = 42 - days.length; // 6줄 기준
    for (let d = 1; d <= nextCount; d++) {
      days.push({
        day: d,
        currentMonth: false,
      });
    }

    return days;
  };

  return {
    year,
    month,
    day,
    current,
    goPrevMonth,
    goNextMonth,
    selectDay,
    getDays,
    setCurrent,
  };
}
