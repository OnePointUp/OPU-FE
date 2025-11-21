import { DailyTodoStats, calendarSeed } from "../db/calendar.db";

// 월간 Mock 데이터 자동 생성
export function generateMockMonthlyData(
  year: number,
  month: number
): DailyTodoStats[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: DailyTodoStats[] = [];

  const todayStr = new Date().toISOString().slice(0, 10);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    // --------------------------
    // 0~6개의 투두 생성 가능 (0개 포함!)
    // --------------------------
    const total = Math.floor(Math.random() * 7); // ⬅️ 0~6개
    const doneCount = total > 0 ? Math.floor(Math.random() * (total + 1)) : 0;
    const ratio = total > 0 ? doneCount / total : 0;

    // --------------------------
    // intensity 계산 (0 레벨 포함)
    // --------------------------
    let intensity = 0;

    if (total === 0 || doneCount === 0) {
      // 투두가 없거나 아무것도 완료 못함 → 0단계
      intensity = 0;
    } else if (ratio >= 0.8) intensity = 5;
    else if (ratio >= 0.6) intensity = 4;
    else if (ratio >= 0.4) intensity = 3;
    else if (ratio >= 0.2) intensity = 2;
    else intensity = 1;

    // --------------------------
    // 투두 리스트 생성 (total = 0일 때 빈 배열)
    // --------------------------
    const todos =
      total > 0
        ? Array.from({ length: total }).map((_, idx) => ({
            id: idx + 1,
            title: `투두 ${idx + 1}`,
            done: idx < doneCount,
          }))
        : [];

    result.push({
      date: dateStr,
      todos,
      total,
      doneCount,
      ratio,
      intensity,
      isToday: dateStr === todayStr,
    });
  }

  return result;
}

// 실제 API처럼 월간 데이터를 반환 (mock)
export function getMonthlyCalendar(
  year: number,
  month: number
): DailyTodoStats[] {
  const isSeeded = calendarSeed[year]?.[month];

  if (isSeeded) {
    return generateMockMonthlyData(year, month);
  }

  return [];
}
