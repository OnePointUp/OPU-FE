// utils/calendar.ts
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";

export function buildCalendarMatrix(data: DailyTodoStats[]) {
  const firstDate = new Date(data[0].date);
  const year = firstDate.getFullYear();
  const month = firstDate.getMonth() + 1;

  const firstDayOfWeek = new Date(`${year}-${String(month).padStart(2, "0")}-01`).getDay(); // 0=일

  const matrix = Array.from({ length: 6 }, () => Array(7).fill(null));

  let dayIndex = 0;

  // 6주 × 7일
  for (let week = 0; week < 6; week++) {
    for (let d = 0; d < 7; d++) {
      if (week === 0 && d < firstDayOfWeek) {
        matrix[week][d] = null; // 이전 달 영역
      }
      else if (dayIndex < data.length) {
        matrix[week][d] = data[dayIndex];
        dayIndex++;
      }
      else {
        matrix[week][d] = null; // 다음 달 영역
      }
    }
  }

  return matrix;
}
