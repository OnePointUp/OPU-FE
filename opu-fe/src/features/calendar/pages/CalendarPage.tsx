"use client";

import CalendarFull from "../components/CalendarFull";
import CalendarContainer from "../components/CalendarContainer";
import CalendarSlider from "../components/CalendarSlider";
import DaySelector from "@/features/main/components/DaySelector";
import TodoList from "@/features/todo/components/TodoList";
import PlusButton from "@/components/common/PlusButton";
import CalendarWeekdayHeader from "../components/CalendarWeekdayHeader";

import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";
import { useCalendarLayout } from "../hooks/useCalendarLayout";
import { useCalendarWindow } from "../hooks/useCalendarWindow";

export default function CalendarPage() {
  const today = new Date();

  const {
    selectedDay,
    editingTodoId,
    selectDay,
    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  } = useCalendarCore();

  const {
    window,
    cursor,
    ready,
    slideNext,
    slidePrev,
    jumpTo,
  } = useCalendarWindow(today.getFullYear(), today.getMonth() + 1);

  const weekCount = window?.current.length ?? 0;

  const {
    daySelectorRef,
    cellHeight,
    setCellHeight,
    expandedHeight,
    collapsedHeight,
    todoHeight,
  } = useCalendarLayout(weekCount);

  return (
    <section className="fixed inset-0 flex flex-col">
      <div className="w-full max-w-[var(--app-max)] mx-auto pt-app-header flex flex-col">
        <div ref={daySelectorRef}>
          <DaySelector
            year={cursor.year}
            month={cursor.month}
            day={
              selectedDay
                ? Number(selectedDay.date.split("-")[2])
                : today.getDate()
            }
            hideViewToggle
            viewMode="month"
            onSelect={(y, m, d) => {
              const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(
                d
              ).padStart(2, "0")}`;
              jumpTo(y, m);
              selectDay(dateStr);
            }}
            onToggleView={() => {}}
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <CalendarContainer
            weekCount={weekCount}
            cellHeight={cellHeight}
            setCellHeight={setCellHeight}
            expandedHeight={expandedHeight}
            collapsedHeight={collapsedHeight}
          >
            <CalendarWeekdayHeader />
            
            {!window || !ready ? (
              <div className="flex items-center justify-center h-full">
                {/* skeleton */}
              </div>
            ) : (
            <CalendarSlider
              prev={
                <CalendarFull
                  calendarMatrix={window.prev}
                  selectedDay={selectedDay}
                  onSelectDay={(d) => d && selectDay(d.date)}
                  cellHeight={cellHeight}
                />
              }
              current={
                <CalendarFull
                  calendarMatrix={window.current}
                  selectedDay={selectedDay}
                  onSelectDay={(d) => d && selectDay(d.date)}
                  cellHeight={cellHeight}
                />
              }
              next={
                <CalendarFull
                  calendarMatrix={window.next}
                  selectedDay={selectedDay}
                  onSelectDay={(d) => d && selectDay(d.date)}
                  cellHeight={cellHeight}
                />
              }
              onPrev={slidePrev}
              onNext={slideNext}
            />
            )}
          </CalendarContainer>

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

        <PlusButton
          showMenu
          onAddEvent={() => {
            handleAdd();
            setCellHeight(collapsedHeight);
          }}
        />
      </div>
    </section>
  );
}
