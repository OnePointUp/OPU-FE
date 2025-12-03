"use client";

import CalendarFull from "../components/CalendarFull";
import CalendarContainer from "../components/CalendarContainer";
import DaySelector from "@/features/main/components/DaySelector";
import TodoList from "@/features/main/components/TodoList";
import PlusButton from "@/components/common/PlusButton";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";
import { useCalendarLayout } from "../hooks/useCalendarLayout";

export default function CalendarPage() {
  const today = new Date();

  const {
    year,
    month,
    calendarData,
    calendarMatrix,
    selectedDay,
    editingTodoId,
    setYear,
    setMonth,
    setSelectedDay,
    selectDay,
    setEditingTodoId,

    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  } = useCalendarCore();

  /** 높이 관련 훅 (UI) */
  const {
    daySelectorRef,
    cellHeight,
    setCellHeight,
    expandedHeight,
    collapsedHeight,
    todoHeight,
  } = useCalendarLayout(calendarMatrix.length);

  /** 날짜 선택 시: collapse */
  const handleSelectDay = (day: DailyTodoStats | null) => {
    if (!day) return;
    selectDay(day);
    setCellHeight(collapsedHeight);
  };

  /** Todo 추가 시: collapse */
  const handleAddTodo = () => {
    handleAdd();
    setCellHeight(collapsedHeight);
  };

  return (
    <section className="fixed inset-0 flex flex-col">
      <div
        className="w-full max-w-[var(--app-max)] mx-auto pt-app-header flex flex-col"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        {/* DaySelector */}
        <div ref={daySelectorRef} className="shrink-0 mb-3">
          <DaySelector
            year={year}
            month={month}
            day={
              selectedDay
                ? Number(selectedDay.date.split("-")[2])
                : today.getDate()
            }
            hideViewToggle={true}
            viewMode="month"
            onSelect={(y, m, d) => {
              setYear(y);
              setMonth(m);

              const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(
                d
              ).padStart(2, "0")}`;

              const found = calendarData.find((dd) => dd.date === dateStr);
              if (found) setSelectedDay(found);
            }}
            onToggleView={() => {}}
          />
        </div>

        {/* Calendar & Todo */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 드래그 캘린더 */}
          <CalendarContainer
            cellHeight={cellHeight}
            setCellHeight={setCellHeight}
            expandedHeight={expandedHeight}
            collapsedHeight={collapsedHeight}
          >
            <CalendarFull
              calendarMatrix={calendarMatrix}
              selectedDay={selectedDay}
              onSelectDay={handleSelectDay}
              cellHeight={cellHeight}
            />
          </CalendarContainer>

          {/* TodoList 영역 */}
          <div
            className="transition-opacity duration-300"
            style={{
              opacity: cellHeight < expandedHeight * 0.8 ? 1 : 0,
              height: todoHeight,
            }}
          >
            <TodoList
              selectedDay={selectedDay}
              onToggleTodo={handleToggle}
              onEditTodo={handleEdit}
              onDeleteTodo={handleDelete}
              onConfirmNewTodo={handleConfirm}
              editingTodoId={editingTodoId}
              maxHeight={todoHeight}
            />
          </div>
        </div>

        {/* 플러스 버튼 */}
        <PlusButton showMenu={true} onAddEvent={handleAddTodo} />
      </div>
    </section>
  );
}
