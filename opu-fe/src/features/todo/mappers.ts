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

    // 백엔드에 없는 필드는 일단 기본값
    content: null,
    createdAt: "",
    updatedAt: "",
  };
}
