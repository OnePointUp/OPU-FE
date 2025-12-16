"use client";

import { useState } from "react";

import CalendarFull, { CalendarDay } from "../components/CalendarFull";
import CalendarContainer from "../components/CalendarContainer";
import CalendarSlider from "../components/CalendarSlider";
import DaySelector from "@/features/main/components/DaySelector";
import TodoList from "@/features/todo/components/TodoList";
import PlusButton from "@/components/common/PlusButton";
import CalendarWeekdayHeader from "../components/CalendarWeekdayHeader";

import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";
import { useCalendarLayout } from "../hooks/useCalendarLayout";
import { useCalendarWindow } from "../hooks/useCalendarWindow";

export type GestureLock = "none" | "horizontal" | "vertical";

export default function CalendarPage() {
  const today = new Date();

  /** 제스처 락 */
  const [gestureLock, setGestureLock] = useState<GestureLock>("none");

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

  /** 날짜 클릭 공통 핸들러 */
  const handleSelectCalendarDay = (day: CalendarDay) => {
    const [y, m] = day.date.split("-").map(Number);
    const isSameDay = selectedDay?.date === day.date;
    
    if (day.isPreview) {
      jumpTo(y, m);
    }

    selectDay(day.date);

    if (isSameDay && cellHeight === collapsedHeight) {
      setCellHeight(expandedHeight);
      return;
    }

    setCellHeight(collapsedHeight);
  };

  /** CalendarFull 렌더 헬퍼 */
  const renderCalendar = (matrix: (CalendarDay | null)[][]) => (
    <CalendarFull
      calendarMatrix={matrix}
      selectedDay={selectedDay}
      onSelectDay={(d) => d && handleSelectCalendarDay(d)}
      cellHeight={cellHeight}
    />
  );

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
            gestureLock={gestureLock}
            setGestureLock={setGestureLock}
          >
            <CalendarWeekdayHeader />

            {!window || !ready ? (
              <div className="flex items-center justify-center h-full" />
            ) : (
              <CalendarSlider
                prev={renderCalendar(window.prev)}
                current={renderCalendar(window.current)}
                next={renderCalendar(window.next)}
                onPrev={slidePrev}
                onNext={slideNext}
                gestureLock={gestureLock}
                setGestureLock={setGestureLock}
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
