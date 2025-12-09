import { apiClient } from "@/lib/apiClient";
import { extractErrorMessage } from "@/utils/api-helpers";

import {
  TodoCreateDto,
  TodoUpdateDto,
  TodoStatusUpdateDto,
  TodoStatisticsDto,
  TodoResponseDto,
  PageResponse,
} from "./domain";
import { mapTodo } from "./mappers";

/* ==== Todo 생성 ===== */
export async function createTodo(payload: TodoCreateDto): Promise<number> {
  try {
    const res = await apiClient.post(`/todos`, payload);
    return res.data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "투두 생성에 실패했어요"));
  }
}

/* ==== OPU 기반 Todo 생성 ===== */
export async function createTodoByOpu(opuId: number, payload: TodoCreateDto) {
  try {
    const res = await apiClient.post(`/opus/${opuId}/todos`, payload);
    return res.data.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "OPU 기반 투두 생성에 실패했어요"));
  }
}

/* ==== Todo 수정 ===== */
export async function updateTodo(todoId: number, payload: TodoUpdateDto) {
  try {
    await apiClient.patch(`/todos/${todoId}`, payload);
    return { ok: true };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "투두 수정에 실패했어요"));
  }
}

/* ==== Todo 상태 변경 ===== */
export async function updateTodoStatus(
  todoId: number,
  payload: TodoStatusUpdateDto
) {
  try {
    await apiClient.patch(`/todos/${todoId}/status`, payload);
    return { ok: true };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "투두 상태 변경에 실패했어요"));
  }
}

/* ==== Todo 정렬 변경 ===== */
export async function reorderTodo(todoId: number, newOrder: number) {
  try {
    await apiClient.patch(`/todos/${todoId}/order`, null, {
      params: { newOrder },
    });
    return { ok: true };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "투두 순서 변경에 실패했어요"));
  }
}

/* ==== Todo 삭제 ===== */
export async function deleteTodo(todoId: number) {
  try {
    await apiClient.delete(`/todos/${todoId}`);
    return { ok: true };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "투두 삭제에 실패했어요"));
  }
}

/* ==== 특정 날짜 기준 Todo 조회 ===== */
export async function fetchTodosByDate(date: string) {
  try {
    const res = await apiClient.get<PageResponse<TodoResponseDto>>(`/todos`, {
      params: { date, page: 0, size: 50 },
    });

    return res.data.content.map((dto) => mapTodo(dto));
  } catch (err) {
    throw new Error(extractErrorMessage(err, "투두 조회에 실패했어요"));
  }
}

/* ==== 월간 통계 조회 ===== */
export async function fetchMonthlyStatistics(
  year: number,
  month: number
): Promise<TodoStatisticsDto[]> {
  try {
    const res = await apiClient.get(`/todos/monthly`, {
      params: { year, month },
    });

    return res.data;
  } catch (err) {
    throw new Error(
      extractErrorMessage(err, "월간 통계를 불러오지 못했어요")
    );
  }
}
