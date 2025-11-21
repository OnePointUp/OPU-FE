'use client';

import { DailyTodoStats } from "@/mocks/api/db/calendar.db";

type Props = {
  selectedDay: DailyTodoStats | null;
};

export default function TodoList({ selectedDay }: Props) {
  if (!selectedDay) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="font-semibold mb-2">
        {selectedDay.date} 투두
      </div>

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
        </div>
      ))}
    </div>
  );
}
