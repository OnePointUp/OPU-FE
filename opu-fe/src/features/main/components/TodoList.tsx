"use client";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";
import { useEffect, useState } from "react";

type Props = {
  selectedDay: DailyTodoStats | null;
  onToggleTodo: (todoId: number) => void;
  onEditTodo: (todoId: number, newTitle: string) => void;
  onDeleteTodo: (todoId: number) => void;
  editingTodoId: number | null;
  loading?: boolean;
};

export default function TodoList({
  selectedDay,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  editingTodoId,
  loading = false,
}: Props) {
  /** ⭐ Hook들은 절대 조건문 안에 넣지 않는다 */
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [targetTodo, setTargetTodo] =
    useState<DailyTodoStats["todos"][number] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  /** 새 Todo 생성 → 자동 편집 */
  useEffect(() => {
    if (!selectedDay) return;
    if (editingTodoId === null) return;

    const todo = selectedDay.todos.find((t) => t.id === editingTodoId);
    if (!todo) return;

    setEditingId(todo.id);
    setEditText(todo.title);
  }, [editingTodoId, selectedDay]);

  /** 스켈레톤 컴포넌트 */
  const SkeletonTodoList = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="h-5 w-24 rounded-md skeleton mb-4" />

      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 w-full">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-5 h-5 rounded-md skeleton" />
            <div className="h-4 w-40 rounded-md skeleton" />
          </div>

          <div className="w-4 h-4 rounded-md skeleton" />
        </div>
      ))}
    </div>
  );

  /** 🔥 return 에서 분기해야 한다 — Hook보다 위에서는 분기 금지 */
  if (loading || !selectedDay) {
    return <SkeletonTodoList />;
  }

  const openActions = (todo: DailyTodoStats["todos"][number]) => {
    setTargetTodo(todo);
    setOpenSheet(true);
  };

  const startEditing = (todo: DailyTodoStats["todos"][number]) => {
    setEditingId(todo.id);
    setEditText(todo.title);
    setOpenSheet(false);
  };

  const finishEditing = () => {
    if (editingId !== null) {
      onEditTodo(editingId, editText.trim());
    }
    setEditingId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = WEEKDAY[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="font-semibold mb-2">{formatDate(selectedDay.date)}</div>

        {selectedDay.todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggleTodo(todo.id)}
                className="custom-checkbox cursor-pointer"
              />

              <div className="flex-1">
                {editingId === todo.id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={finishEditing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") finishEditing();
                    }}
                    className="input-box input-box--field w-full"
                    autoFocus
                  />
                ) : (
                  <span
                    className={
                      "block w-full " +
                      (todo.done ? "line-through text-gray-400" : "")
                    }
                  >
                    {todo.title}
                  </span>
                )}
              </div>
            </div>

            <Icon
              icon="vaadin:ellipsis-dots-v"
              width={14}
              height={14}
              className="text-[var(--color-light-gray)] rotate-90 cursor-pointer ml-2"
              onClick={() => openActions(todo)}
            />
          </div>
        ))}
      </div>

      <TodoActionSheet
        open={openSheet}
        todo={targetTodo}
        onClose={() => setOpenSheet(false)}
        onEdit={startEditing}
        addRoutine={() => setOpenSheet(false)}
        onDelete={(todo) => {
          onDeleteTodo(todo.id);
          setOpenSheet(false);
        }}
      />
    </>
  );
}
