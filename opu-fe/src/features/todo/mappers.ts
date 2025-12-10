import { ApiResponse } from "@/types/api";
import { Todo, TodoResponseDto } from "./domain";

export function mapTodo(dto: TodoResponseDto): Todo {
  return {
    id: dto.id,
    title: dto.title,
    scheduledDate: dto.scheduledDate,
    scheduledTime: dto.scheduledTime,
    completed: dto.completed,
    order: dto.sortOrder,
    content: null,
  };
}
