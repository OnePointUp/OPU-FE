"use client";

import Calendar from "../components/Calendar";
import TodoList from "../components/TodoList";
import PlusButton from "@/components/common/PlusButton";
import { useCalendarTodo } from "@/features/calendar/hooks/useCalendarTodo";

export default function MainPage() {
  const {
    selectedDay,
    editingTodoId,
    handleSelectDay,
    handleToggleTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleAddTodo,
    handleConfirmNewTodo,
  } = useCalendarTodo();

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">
        {/* 캘린더 (메인 전용 컴포넌트) */}
        <Calendar selectedDay={selectedDay} onSelectDay={handleSelectDay} />

        {/* TodoList */}
        <TodoList
          selectedDay={selectedDay}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
          onConfirmNewTodo={handleConfirmNewTodo}
          editingTodoId={editingTodoId}
        />

        {/* 플러스 버튼 */}
        <PlusButton showMenu={true} onAddEvent={handleAddTodo} />
      </main>
    </div>
  );
}
