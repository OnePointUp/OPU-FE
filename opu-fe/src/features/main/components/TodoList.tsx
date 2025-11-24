'use client';

import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";
import { useState } from "react";

type Props = {
  selectedDay: DailyTodoStats | null;
  onToggleTodo: (todoId: number) => void;
  onEditTodo: (todoId: number, newTitle: string) => void;
  onDeleteTodo: (todoId: number) => void;
};

export default function TodoList({ selectedDay, onToggleTodo, onEditTodo, onDeleteTodo }: Props) {
  const [openSheet, setOpenSheet] = useState(false);
  const [targetTodo, setTargetTodo] =
    useState<DailyTodoStats["todos"][number] | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  if (!selectedDay) return null;

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
        <div className="font-semibold mb-2">
          {formatDate(selectedDay.date)}
        </div>

        {selectedDay.todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between py-4"
          >
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
                    onKeyDown={(e) => { if (e.key === "Enter") finishEditing(); }}
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
        onEdit={(todo) => startEditing(todo)}
        addRoutine={() => setOpenSheet(false)}
        onDelete={(todo) => {
          onDeleteTodo(todo.id);
          setOpenSheet(false);
        }}
      />
    </>
  );
}
