import type { CalendarDay } from "@/features/calendar/components/CalendarFull";

function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function buildCalendarMatrix(
  stats: {
    date: string;
    totalCount: number;
    completedCount: number;
  }[],
  year: number,
  month: number
): (CalendarDay | null)[][] {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekDay = firstDay.getDay();
  const matrix: (CalendarDay | null)[][] = [];

  const todayStr = getLocalDateString();

  let dayCounter = 1 - firstWeekDay;

  for (let w = 0; w < 6; w++) {
    const row: (CalendarDay | null)[] = [];

    for (let d = 0; d < 7; d++) {
      const current = new Date(year, month - 1, dayCounter);
      const dateStr = getLocalDateString(current);

      const isInMonth = current.getMonth() + 1 === month;

      row.push({
        date: dateStr,
        isPreview: !isInMonth,
        isToday: dateStr === todayStr,
        todos: [],
      });

      dayCounter++;
    }

    matrix.push(row);
  }

  return matrix;
}
