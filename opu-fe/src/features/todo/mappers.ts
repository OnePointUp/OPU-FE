import { ApiResponse } from "@/types/api";
import { Todo, TodoResponseDto } from "./domain";

export function mapTodo(dto: TodoResponseDto): Todo {
  return {
    id: dto.id,
    routineId: dto.routineId,
    opuId: dto.opuId,
    title: dto.title,
    scheduledDate: dto.scheduledDate,
    scheduledTime: dto.scheduledTime,
    completed: dto.completed,
    order: dto.sortOrder,
    content: null,
  };
}
