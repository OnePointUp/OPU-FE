"use client";

import { useState, useEffect, useRef } from "react";
import {
  getMonthlyCalendar,
  toggleTodo,
} from "@/mocks/api/handler/calendar.handler";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { buildCalendarMatrix } from "@/lib/calendar";

import TodoList from "@/features/main/components/TodoList";
import PlusButton from "@/components/common/PlusButton";
import CalendarFull from "../components/CalendarFull";
import CalendarContainer from "../hooks/CalendarContainer";
import DaySelector from "@/features/main/components/DaySelector";

/** 미완 → 완료 순 정렬 */
const sortTodos = (todos: DailyTodoStats["todos"]) => {
  return [...todos].sort((a, b) => {
    if (a.done === b.done) return a.id - b.id;
    return a.done ? 1 : -1;
  });
};

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [calendarData, setCalendarData] = useState<DailyTodoStats[]>([]);
  const [calendarMatrix, setCalendarMatrix] = useState<
    (DailyTodoStats | null)[][]
  >([]);
  const [selectedDay, setSelectedDay] = useState<DailyTodoStats | null>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [todoHeight, setTodoHeight] = useState(0);

  /** 셀 높이 관련 */
  const [cellHeight, setCellHeight] = useState(90);
  const [expandedHeight, setExpandedHeight] = useState(90);
  const [collapsedHeight, setCollapsedHeight] = useState(45);

  const daySelectorRef = useRef<HTMLDivElement>(null);

  /** 초기 데이터 로딩 */
  useEffect(() => {
    const data = getMonthlyCalendar(year, month);

    const sorted = data.map((d) => ({
      ...d,
      todos: sortTodos(d.todos),
    }));

    setCalendarData(sorted);
    setCalendarMatrix(buildCalendarMatrix(sorted));

    if (!selectedDay) {
      const todayItem = sorted.find((d) => d.isToday);
      if (todayItem) setSelectedDay(todayItem);
    }
  }, [year, month]);

  /** 날짜 선택 */
  const handleSelectDay = (day: DailyTodoStats) => {
    const date = new Date(day.date);

    setEditingTodoId(null);

    setSelectedDay({
      ...day,
      todos: sortTodos(day.todos),
    });

    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);

    setCellHeight(collapsedHeight);
  };

  /** Todo 체크 */
  const handleToggleTodo = (todoId: number) => {
    if (!selectedDay) return;

    const [y, m] = selectedDay.date.split("-").map(Number);
    toggleTodo(y, m, selectedDay.date, todoId);

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo
        );

        todos = sortTodos(todos);

        return {
          ...day,
          todos,
          doneCount: todos.filter((t) => t.done).length,
          total: todos.length,
        };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));
      setSelectedDay(updated.find((d) => d.date === selectedDay.date) ?? null);
      return updated;
    });
  };

  /** Todo 수정 */
  const handleEditTodo = (todoId: number, newTitle: string, time: any) => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.map((todo) =>
          todo.id === todoId
            ? { ...todo, title: newTitle, time: time ?? null }
            : todo
        );

        todos = sortTodos(todos);

        return { ...day, todos };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));
      setSelectedDay(updated.find((d) => d.date === selectedDay.date) ?? null);
      return updated;
    });

    setEditingTodoId(null);
  };

  /** Todo 삭제 */
  const handleDeleteTodo = (todoId: number) => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.filter((todo) => todo.id !== todoId);
        todos = sortTodos(todos);

        return {
          ...day,
          todos,
          doneCount: todos.filter((t) => t.done).length,
          total: todos.length,
        };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));
      setSelectedDay(updated.find((d) => d.date === selectedDay.date) ?? null);

      return updated;
    });
  };

  /** Todo 추가 */
  const handleAddTodo = () => {
    if (!selectedDay) return;

    const tempId =
      selectedDay.todos.length > 0
        ? Math.max(...selectedDay.todos.map((t) => t.id)) + 1
        : 1;

    const newTempTodo = {
      id: tempId,
      title: "",
      done: false,
      time: null,
    };

    setCalendarData(prev => {
      const updated = prev.map(day => {
        if (day.date !== selectedDay.date) return day;

        const todos = [...day.todos, newTempTodo];
        return {
          ...day,
          todos
        };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));
      setSelectedDay(updated.find(d => d.date === selectedDay.date) ?? null);

      return updated;
    });

    setEditingTodoId(tempId);
    setCellHeight(collapsedHeight);
  };

  const handleConfirmNewTodo = (newId: number, newTitle: string, time: any) => {
    if (!selectedDay) return;

    setCalendarData((prev) => {
      const updated = prev.map((day) => {
        if (day.date !== selectedDay.date) return day;

        let todos = day.todos.map((todo) =>
          todo.id === newId
            ? { id: newId, title: newTitle, done: false, time }
            : todo
        );

        todos = sortTodos(todos);

        return {
          ...day,
          todos,
          doneCount: todos.filter((t) => t.done).length,
          total: todos.length,
        };
      });

      setCalendarMatrix(buildCalendarMatrix(updated));
      setSelectedDay(updated.find((d) => d.date === selectedDay.date) ?? null);

      return updated;
    });

    setEditingTodoId(null);
  };

  /** 화면 높이 계산 */
  useEffect(() => {
    if (!calendarMatrix.length) return;

    const vh = window.innerHeight;

    const daySelectorH = daySelectorRef.current?.offsetHeight ?? 60;
    const bottomNavH = 80;
    const plusButtonSpace = 70;
    const topPadding = 70;

    const remained =
      vh -
      daySelectorH -
      bottomNavH -
      plusButtonSpace -
      topPadding;

    const weekCount = calendarMatrix.length;
    const newCellHeight = remained / weekCount;

    const minH = 55;
    const maxH = 160;

    const finalH = Math.max(minH, Math.min(newCellHeight, maxH));

    setExpandedHeight(finalH);
    setCollapsedHeight(finalH * 0.55);

  }, [calendarMatrix.length]);

  /** TodoList 높이 계산 */
  useEffect(() => {
    if (!calendarMatrix.length) return;
    if (!daySelectorRef.current) return;

    const vh = window.innerHeight;
    const daySelectorH = daySelectorRef.current.offsetHeight;

    const calendarHeight = cellHeight * calendarMatrix.length + 20;
    const menuHeight = 55;
    const plusButtonArea = 90;
    const safePadding = 35;

    const available =
      vh -
      daySelectorH -
      calendarHeight -
      menuHeight -
      plusButtonArea -
      safePadding;

    setTodoHeight(Math.max(0, available));
  }, [cellHeight, calendarMatrix.length]);

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
              onToggleTodo={handleToggleTodo}
              onEditTodo={handleEditTodo}
              onDeleteTodo={handleDeleteTodo}
              onConfirmNewTodo={handleConfirmNewTodo}
              editingTodoId={editingTodoId}
              maxHeight={todoHeight}
            />
          </div>
        </div>

        <PlusButton showMenu={true} onAddEvent={handleAddTodo} />
      </div>
    </section>
  );
}
