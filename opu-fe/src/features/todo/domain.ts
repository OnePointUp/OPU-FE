/* ==== 단일 Todo ==== */
export interface Todo {
  id: number;
  routineId?: number | null;
  opuId?: number | null;
  title: string;
  content?: string | null;

  scheduledDate: string;
  scheduledTime: string | null;

  completed: boolean;
  order: number;

  createdAt?: string;
  updatedAt?: string;
}

/* ==== 공통 API Response ==== */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errorCode?: string;
  message?: string;
  timestamp: string;
}

/* ==== 페이징 응답 ==== */
export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: T[];
  hasNext: boolean;
  hasPrevious: boolean;
}

/* ==== 생성 요청 DTO ==== */
export interface TodoCreateDto {
  title: string;
  scheduledDate: string;
  scheduledTime?: string | null;
}

/* ==== 상태 변경 DTO ==== */
export interface TodoStatusUpdateDto {
  completed: boolean;
}

/* ==== 수정 DTO ==== */
export interface TodoUpdateDto {
  title?: string;
  content?: string;
  scheduledDate?: string;
  scheduledTime?: string | null;
}

/* ==== 조회 응답 DTO ==== */
export interface TodoResponseDto {
  id: number;
  routineId: number | null;
  opuId: number | null;

  title: string;
  scheduledDate: string;        // LocalDate → string
  scheduledTime: string | null; // LocalTime → string or null

  sortOrder: number;
  completed: boolean;
}

/* ==== 월간 / 주간 통계 ==== */
export interface TodoStatisticsDto {
  date: string;
  totalCount: number;
  completedCount: number;
}
