// mockCalendar.ts

// -------------------------------------------------------------
// 색상 단계별 색상
// -------------------------------------------------------------
export const COLORS: Record<number, string> = {
  1: "#F1F8E5",
  2: "#E3F1CB",
  3: "#D4EBB0",
  4: "#C6E496",
  5: "#B8DD7C",
};

// -------------------------------------------------------------
// 타입 정의
// -------------------------------------------------------------
export type DailyTodoStats = {
  date: string; // "2025-11-01"
  todos: {
    id: number;
    title: string;
    done: boolean;
  }[];
  total: number; // 전체 투두 개수
  doneCount: number; // 완료한 투두 개수
  ratio: number; // 완료 비율 (0~1)
  intensity: number; // 색상 단계 1~5
  isToday: boolean; // 오늘 여부
};

// -------------------------------------------------------------
// 월간 Mock 데이터 자동 생성 함수
// -------------------------------------------------------------
export function generateMockMonthlyData(
  year: number,
  month: number // 1~12
): DailyTodoStats[] {
  const daysInMonth = 30; // 필요 시 달마다 자동 계산 가능
  const result: DailyTodoStats[] = [];

  const todayStr = new Date().toISOString().slice(0, 10);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    // 투두 개수 (임의 생성)
    const total = Math.floor(Math.random() * 5) + 2; // 2~6개
    const doneCount = Math.floor(Math.random() * (total + 1));
    const ratio = total > 0 ? doneCount / total : 0;

    // 완료 비율 → 색상 단계
    let intensity = 1;
    if (ratio >= 0.8) intensity = 5;
    else if (ratio >= 0.6) intensity = 4;
    else if (ratio >= 0.4) intensity = 3;
    else if (ratio >= 0.2) intensity = 2;
    else intensity = 1;

    // 투두 리스트 생성
    const todos = Array.from({ length: total }).map((_, idx) => ({
      id: idx + 1,
      title: `투두 ${idx + 1}`,
      done: idx < doneCount,
    }));

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

export const mockNovember = [
  {
    date: "2025-11-01",
    total: 4,
    doneCount: 2,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: false },
      { id: 4, title: "투두 4", done: false },
    ],
  },
  {
    date: "2025-11-02",
    total: 3,
    doneCount: 1,
    ratio: 0.33,
    intensity: 2,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: false },
      { id: 3, title: "투두 3", done: false },
    ],
  },
  {
    date: "2025-11-03",
    total: 6,
    doneCount: 5,
    ratio: 0.83,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: true },
      { id: 4, title: "투두 4", done: true },
      { id: 5, title: "투두 5", done: true },
      { id: 6, title: "투두 6", done: false },
    ],
  },
  {
    date: "2025-11-04",
    total: 5,
    doneCount: 0,
    ratio: 0,
    intensity: 1,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: false },
      { id: 2, title: "투두 2", done: false },
      { id: 3, title: "투두 3", done: false },
      { id: 4, title: "투두 4", done: false },
      { id: 5, title: "투두 5", done: false },
    ],
  },
  {
    date: "2025-11-05",
    total: 4,
    doneCount: 4,
    ratio: 1,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: true },
      { id: 4, title: "투두 4", done: true },
    ],
  },
  {
    date: "2025-11-06",
    total: 3,
    doneCount: 2,
    ratio: 0.66,
    intensity: 4,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: false },
    ],
  },
  {
    date: "2025-11-07",
    total: 2,
    doneCount: 0,
    ratio: 0,
    intensity: 1,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: false },
      { id: 2, title: "투두 2", done: false },
    ],
  },
  {
    date: "2025-11-08",
    total: 4,
    doneCount: 3,
    ratio: 0.75,
    intensity: 4,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: true },
      { id: 4, title: "투두 4", done: false },
    ],
  },
  {
    date: "2025-11-09",
    total: 2,
    doneCount: 1,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: false },
    ],
  },
  {
    date: "2025-11-10",
    total: 6,
    doneCount: 2,
    ratio: 0.33,
    intensity: 2,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: false },
      { id: 4, title: "투두 4", done: false },
      { id: 5, title: "투두 5", done: false },
      { id: 6, title: "투두 6", done: false },
    ],
  },

  {
    date: "2025-11-11",
    total: 3,
    doneCount: 3,
    ratio: 1,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
      { id: 3, title: "투두 3", done: true },
    ],
  },
  {
    date: "2025-11-12",
    total: 5,
    doneCount: 1,
    ratio: 0.2,
    intensity: 2,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: false },
      { id: 3, title: "투두 3", done: false },
      { id: 4, title: "투두 4", done: false },
      { id: 5, title: "투두 5", done: false },
    ],
  },
  {
    date: "2025-11-13",
    total: 4,
    doneCount: 1,
    ratio: 0.25,
    intensity: 2,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: false },
      { id: 3, title: "투두 3", done: false },
      { id: 4, title: "투두 4", done: false },
    ],
  },
  {
    date: "2025-11-14",
    total: 2,
    doneCount: 2,
    ratio: 1,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, title: "투두 1", done: true },
      { id: 2, title: "투두 2", done: true },
    ],
  },
  {
    date: "2025-11-15",
    total: 5,
    doneCount: 3,
    ratio: 0.6,
    intensity: 4,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: true, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
      { id: 5, done: false, title: "투두 5" },
    ],
  },
  {
    date: "2025-11-16",
    total: 3,
    doneCount: 0,
    ratio: 0,
    intensity: 1,
    isToday: false,
    todos: [
      { id: 1, done: false, title: "투두 1" },
      { id: 2, done: false, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
    ],
  },
  {
    date: "2025-11-17",
    total: 4,
    doneCount: 2,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
    ],
  },
  {
    date: "2025-11-18",
    total: 3,
    doneCount: 1,
    ratio: 0.33,
    intensity: 2,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: false, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
    ],
  },

  {
    date: "2025-11-19",
    total: 4,
    doneCount: 3,
    ratio: 0.75,
    intensity: 4,
    isToday: true, // ⭐ 현재 날짜
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: true, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
    ],
  },

  {
    date: "2025-11-20",
    total: 2,
    doneCount: 1,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: false, title: "투두 2" },
    ],
  },
  {
    date: "2025-11-21",
    total: 6,
    doneCount: 6,
    ratio: 1,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: true, title: "투두 3" },
      { id: 4, done: true, title: "투두 4" },
      { id: 5, done: true, title: "투두 5" },
      { id: 6, done: true, title: "투두 6" },
    ],
  },
  {
    date: "2025-11-22",
    total: 3,
    doneCount: 2,
    ratio: 0.66,
    intensity: 4,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
    ],
  },
  {
    date: "2025-11-23",
    total: 4,
    doneCount: 0,
    ratio: 0,
    intensity: 1,
    isToday: false,
    todos: [
      { id: 1, done: false, title: "투두 1" },
      { id: 2, done: false, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
    ],
  },
  {
    date: "2025-11-24",
    total: 5,
    doneCount: 4,
    ratio: 0.8,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: true, title: "투두 3" },
      { id: 4, done: true, title: "투두 4" },
      { id: 5, done: false, title: "투두 5" },
    ],
  },
  {
    date: "2025-11-25",
    total: 2,
    doneCount: 1,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: false, title: "투두 2" },
    ],
  },
  {
    date: "2025-11-26",
    total: 4,
    doneCount: 2,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
    ],
  },
  {
    date: "2025-11-27",
    total: 5,
    doneCount: 1,
    ratio: 0.2,
    intensity: 2,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: false, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
      { id: 5, done: false, title: "투두 5" },
    ],
  },
  {
    date: "2025-11-28",
    total: 3,
    doneCount: 3,
    ratio: 1,
    intensity: 5,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: true, title: "투두 3" },
    ],
  },
  {
    date: "2025-11-29",
    total: 4,
    doneCount: 2,
    ratio: 0.5,
    intensity: 3,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: false, title: "투두 3" },
      { id: 4, done: false, title: "투두 4" },
    ],
  },
  {
    date: "2025-11-30",
    total: 6,
    doneCount: 4,
    ratio: 0.66,
    intensity: 4,
    isToday: false,
    todos: [
      { id: 1, done: true, title: "투두 1" },
      { id: 2, done: true, title: "투두 2" },
      { id: 3, done: true, title: "투두 3" },
      { id: 4, done: true, title: "투두 4" },
      { id: 5, done: false, title: "투두 5" },
      { id: 6, done: false, title: "투두 6" },
    ],
  },
];
