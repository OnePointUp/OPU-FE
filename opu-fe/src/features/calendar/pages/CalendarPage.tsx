"use client";

import CalendarFull, { CalendarDay } from "../components/CalendarFull";
import CalendarContainer from "../components/CalendarContainer";
import CalendarSlider from "../components/CalendarSlider";
import DaySelector from "@/features/main/components/DaySelector";
import TodoList from "@/features/todo/components/TodoList";
import PlusButton from "@/components/common/PlusButton";

import { useCalendarCore } from "@/features/calendar/hooks/useCalendarCore";
import { useCalendarLayout } from "../hooks/useCalendarLayout";
import { useCalendarSlideMatrices } from "@/features/calendar/hooks/useCalendarSlideMatrices";

import CalendarWeekdayHeader from "../components/CalendarWeekdayHeader";

export default function CalendarPage() {
  const today = new Date();

  const {
    year,
    month,
    calendarData,       // ← CalendarDay[] 로 변경됨
    selectedDay,        // ← CalendarDay | null
    editingTodoId,
    setYear,
    setMonth,
    setSelectedDay,
    selectDay,          // ← 날짜 클릭 시 서버에서 todos 불러오는 함수
    handleToggle,
    handleEdit,
    handleDelete,
    handleAdd,
    handleConfirm,
  } = useCalendarCore();

  // CalendarDay 기반 매트릭스
  const { prevMatrix, currentMatrix, nextMatrix } =
    useCalendarSlideMatrices(year, month);

  const weekCount = currentMatrix.length;

  const {
    daySelectorRef,
    cellHeight,
    setCellHeight,
    expandedHeight,
    collapsedHeight,
    todoHeight,
  } = useCalendarLayout(weekCount);

  /** 날짜 선택 핸들러 */
  const handleSelectDay = (day: CalendarDay | null) => {
    if (!day) return;

    // 서버에서 해당 날짜의 Todo 목록 불러오기
    selectDay(day.date);

    const d = new Date(day.date);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);

    // 캘린더 접기
    setCellHeight(collapsedHeight);
  };

  /** 월 이동 */
  const goPrev = () => {
    const m = month - 1;
    if (m < 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(m);
    }
  };

  const goNext = () => {
    const m = month + 1;
    if (m > 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(m);
    }
  };

  const renderCalendar = (matrix: (CalendarDay | null)[][]) => (
    <CalendarFull
      calendarMatrix={matrix}
      selectedDay={selectedDay}
      onSelectDay={handleSelectDay}
      cellHeight={cellHeight}
    />
  );

  return (
    <section className="fixed inset-0 flex flex-col">
      <div
        className="w-full max-w-[var(--app-max)] mx-auto pt-app-header flex flex-col"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        {/* Day Selector */}
        <div ref={daySelectorRef} className="shrink-0">
          <DaySelector
            year={year}
            month={month}
            day={
              selectedDay
                ? Number(selectedDay.date.split("-")[2])
                : today.getDate()
            }
            hideViewToggle
            viewMode="month"
            onSelect={(y, m, d) => {
              setYear(y);
              setMonth(m);

              const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(
                d
              ).padStart(2, "0")}`;

              selectDay(dateStr);
            }}
            onToggleView={() => {}}
          />
        </div>

        {/* Calendar + TodoList 영역 */}
        <div className="flex-1 flex flex-col min-h-0">
          <CalendarContainer
            weekCount={weekCount}
            cellHeight={cellHeight}
            setCellHeight={setCellHeight}
            expandedHeight={expandedHeight}
            collapsedHeight={collapsedHeight}
          >
            <CalendarWeekdayHeader />

            <CalendarSlider
              prev={renderCalendar(prevMatrix)}
              current={renderCalendar(currentMatrix)}
              next={renderCalendar(nextMatrix)}
              onPrev={goPrev}
              onNext={goNext}
            />
          </CalendarContainer>

          {/* TodoList */}
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

        <PlusButton
          showMenu={true}
          onAddEvent={() => {
            handleAdd();
            setCellHeight(collapsedHeight);
          }}
        />
      </div>
    </section>
  );
}
