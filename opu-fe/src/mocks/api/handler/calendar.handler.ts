import { DailyTodoStats } from "../db/calendar.db";
import { calendarStore } from "../stores/calendar.store";

// ---------------------------------------------------------
// 📌 월간 Mock 데이터 생성 함수 (랜덤 생성)
// ---------------------------------------------------------
function createMonthlyMockData(
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

    const total = Math.floor(Math.random() * 7);
    const doneCount = total > 0 ? Math.floor(Math.random() * (total + 1)) : 0;
    const ratio = total > 0 ? doneCount / total : 0;

    let intensity = 0;
    if (total === 0 || doneCount === 0) intensity = 0;
    else if (ratio >= 0.8) intensity = 5;
    else if (ratio >= 0.6) intensity = 4;
    else if (ratio >= 0.4) intensity = 3;
    else if (ratio >= 0.2) intensity = 2;
    else intensity = 1;

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

// ---------------------------------------------------------
// 📌 getMonthlyCalendar
//   - 랜덤 생성은 최초 1회
//   - 이후에는 store에 저장된 데이터 사용
// ---------------------------------------------------------
export function getMonthlyCalendar(
  year: number,
  month: number
): DailyTodoStats[] {
  if (calendarStore[year]?.[month]) {
    return calendarStore[year][month];
  }

  const data = createMonthlyMockData(year, month);

  if (!calendarStore[year]) calendarStore[year] = {};
  calendarStore[year][month] = data;

  return data;
}

// ---------------------------------------------------------
// 📌 toggleTodo
// ---------------------------------------------------------
export function toggleTodo(
  year: number,
  month: number,
  date: string,
  todoId: number
) {
  const monthData = calendarStore[year]?.[month];
  if (!monthData) return;

  const day = monthData.find((d) => d.date === date);
  if (!day) return;

  const todo = day.todos.find((t) => t.id === todoId);
  if (!todo) return;

  todo.done = !todo.done;

  day.doneCount = day.todos.filter((t) => t.done).length;
  day.total = day.todos.length;
  day.ratio = day.total > 0 ? day.doneCount / day.total : 0;

  if (day.doneCount === 0) day.intensity = 0;
  else if (day.ratio >= 0.8) day.intensity = 5;
  else if (day.ratio >= 0.6) day.intensity = 4;
  else if (day.ratio >= 0.4) day.intensity = 3;
  else if (day.ratio >= 0.2) day.intensity = 2;
  else day.intensity = 1;
}
