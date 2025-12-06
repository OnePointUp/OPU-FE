import { DailyTodoStats } from "@/mocks/api/db/calendar.db";

const fmt = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/**
 * 달력 한 줄(week)을 실제 렌더링 가능한 날짜 셀 배열로 변환하는 유틸.
 * 연속된 빈 주도 matrixStartDate + offset 로 완벽 처리됨.
 */
export function useCalendarWeek() {
  function buildWeekCells(
    week: (DailyTodoStats | null)[],
    weekIndex: number,
    matrixStartDate: Date
  ) {
    return week.map((day, di) => {
      // flat index (0~41)
      const offset = weekIndex * 7 + di;

      // 이 칸의 실제 날짜 = 달력 시작일 + offset
      const dateObj = new Date(matrixStartDate);
      dateObj.setDate(matrixStartDate.getDate() + offset);

      const y = dateObj.getFullYear();
      const m = dateObj.getMonth() + 1;
      const d = dateObj.getDate();

      if (!day) {
        // 빈 칸(이전달/다음달) → preview day로 변환
        return {
          date: fmt(y, m, d),
          todos: [],
          total: 0,
          doneCount: 0,
          ratio: 0,
          intensity: 0,
          isToday: false,
          isPreview: true,
        };
      }

      // 실제 날짜
      return {
        ...day,
        date: fmt(y, m, d),
        isPreview: false,
      };
    });
  }

  return { buildWeekCells };
}
