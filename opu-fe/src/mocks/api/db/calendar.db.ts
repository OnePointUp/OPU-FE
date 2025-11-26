// 타입 정의
export type DailyTodoStats = {
  date: string;
  todos: {
    id: number;
    title: string;
    done: boolean;
    time?: {
      ampm: "AM" | "PM";
      hour: number;
      minute: number;
    } | null;
  }[];
  total: number;       // 전체 투두 개수
  doneCount: number;   // 완료한 투두 개수
  ratio: number;       // 완료 비율 (0~1)
  intensity: number;   // 색상 단계 1~5
  isToday: boolean;    // 오늘인지 여부
};

// 캘린더 색상 (단계별 색)
export const CALENDAR_COLORS: Record<number, string> = {
  0: "#F1F5F9",
  1: "#F1F8E5",
  2: "#E3F1CB",
  3: "#D4EBB0",
  4: "#C6E496",
  5: "#B8DD7C",
};


export type CalendarSeedType = {
  [year: number]: {
    [month: number]: boolean;
  };
};

export const calendarSeed: CalendarSeedType = {
  2025: {
    10: true,
    11: true,
    12: true,
  },
};
