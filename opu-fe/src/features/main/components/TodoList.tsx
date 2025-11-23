'use client';

import { useState } from "react";
import { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";

type Props = {
  selectedDay: DailyTodoStats | null;
};

export default function TodoList({ selectedDay }: Props) {
  const [openSheet, setOpenSheet] = useState(false);
  const [targetTodo, setTargetTodo] = useState<
    DailyTodoStats["todos"][number] | null
  >(null);

  if (!selectedDay) return null;

  const openActions = (todo: DailyTodoStats["todos"][number]) => {
    setTargetTodo(todo);
    setOpenSheet(true);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="font-semibold mb-2">{selectedDay.date}</div>

        {selectedDay.todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.done}
                readOnly
                className="custom-checkbox"
              />
              <span className={todo.done ? "line-through text-gray-400" : ""}>
                {todo.title}
              </span>
            </div>

            {/* 메뉴 아이콘 */}
            <Icon
              icon="vaadin:ellipsis-dots-v"
              width={14}
              height={14}
              className="text-[var(--color-light-gray)] rotate-90 cursor-pointer"
              onClick={() => openActions(todo)}
            />
          </div>
        ))}
      </div>

      {/* BottomSheet 메뉴 */}
      <TodoActionSheet
        open={openSheet}
        todo={targetTodo}
        onClose={() => setOpenSheet(false)}
        onEdit={(todo) => {
          console.log("수정 실행:", todo);
          setOpenSheet(false);
        }}
        addRoutine={(todo) => {
          console.log("루트 추가 실행:", todo);
          setOpenSheet(false);
        }}
        onDelete={(todo) => {
          console.log("삭제 실행:", todo);
          setOpenSheet(false);
        }}
      />
    </>
  );
}
