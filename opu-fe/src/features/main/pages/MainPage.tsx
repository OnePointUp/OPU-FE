"use client";

import Calendar from "../components/Calendar";
import TodoList from "../components/TodoList";
import PlusButton from "@/components/common/PlusButton";

import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";

export default function MainPage() {
  const {
    year,
    month,
    selectedDay,
    editingTodoId,
    setYear,
    setMonth,
    selectDay,
    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  } = useCalendarCore();

  return (
    <div className="app-page">
      <main className="app-container pt-app-header pb-40 px-4">
        {/* 캘린더 */}
        <Calendar
          selectedDay={selectedDay}
          onSelectDay={(day) => {
            selectDay(day);
            const d = new Date(day.date);
            setYear(d.getFullYear());
            setMonth(d.getMonth() + 1);
          }}
        />

        {/* TodoList */}
        <TodoList
          selectedDay={selectedDay}
          onToggleTodo={handleToggle}
          onEditTodo={handleEdit}
          onDeleteTodo={handleDelete}
          onConfirmNewTodo={handleConfirm}
          editingTodoId={editingTodoId}
        />

        {/* 플러스 버튼 */}
        <PlusButton showMenu={true} onAddEvent={handleAdd} />
      </main>
    </div>
  );
}
