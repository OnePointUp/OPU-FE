"use client";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";
import { useEffect, useState, MouseEvent } from "react";
import Toggle from "@/components/common/Toggle";
import WheelPickerTime from "./WheelPickerTime";
import { toastError } from "@/lib/toast";

type Props = {
  selectedDay: DailyTodoStats | null;
  onToggleTodo: (todoId: number) => void;
  onEditTodo: (
    todoId: number,
    newTitle: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => void;
  onDeleteTodo: (todoId: number) => void;
  editingTodoId: number | null;
  loading?: boolean;
  maxHeight?: number;
};

export default function TodoList({
  selectedDay,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  editingTodoId,
  loading = false,
  maxHeight,
}: Props) {
  const [openSheet, setOpenSheet] = useState(false);
  const [targetTodo, setTargetTodo] =
    useState<DailyTodoStats["todos"][number] | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeValue, setTimeValue] = useState({
    ampm: "AM" as "AM" | "PM",
    hour: 9,
    minute: 0,
  });

  const [originalTitle, setOriginalTitle] = useState("");
  const [originalTime, setOriginalTime] = useState<
    { ampm: "AM" | "PM"; hour: number; minute: number } | null
  >(null);

  /* 편집 초기값 세팅 */
  useEffect(() => {
    if (!selectedDay) return;
    if (editingTodoId == null) return;

    const todo = selectedDay.todos.find((t) => t.id === editingTodoId);
    if (!todo) return;

    setEditingId(todo.id);
    setEditText(todo.title);

    setOriginalTitle(todo.title);
    setOriginalTime(todo.time ?? null);

    if (todo.time) {
      setShowTimePicker(true);
      setTimeValue(todo.time);
    } else {
      setShowTimePicker(false);
      setTimeValue({
        ampm: "AM",
        hour: 9,
        minute: 0,
      });
    }
  }, [editingTodoId, selectedDay]);

  const stopBlur = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const saveEditing = () => {
    if (!editingId) return;

    const title = editText.trim();

    if (title === "") {
      toastError("제목은 비워둘 수 없습니다.");
      return;
    }

    const time = showTimePicker ? timeValue : null;
    onEditTodo(editingId, title, time);

    setEditingId(null);
    setShowTimePicker(false);
  };

  const cancelEditing = () => {
    if (!editingId) return;

    if (originalTitle === "" && editText.trim() === "") {
      onDeleteTodo(editingId);
    }

    setEditText(originalTitle);
    setTimeValue(
      originalTime ?? {
        ampm: "AM",
        hour: 9,
        minute: 0,
      }
    );
    setShowTimePicker(!!originalTime);

    setEditingId(null);
  };

  const openActions = (todo: DailyTodoStats["todos"][number]) => {
    setTargetTodo(todo);
    setOpenSheet(true);
  };

  const startEditing = (todo: DailyTodoStats["todos"][number]) => {
    setEditingId(todo.id);
    setEditText(todo.title);

    setOriginalTitle(todo.title);
    setOriginalTime(todo.time ?? null);

    if (todo.time) {
      setShowTimePicker(true);
      setTimeValue(todo.time);
    } else {
      setShowTimePicker(false);
      setTimeValue({
        ampm: "AM",
        hour: 9,
        minute: 0,
      });
    }

    setOpenSheet(false);
  };

  const formatTime = (time: any) => {
    if (!time) return null;
    const minute = String(time.minute).padStart(2, "0");
    return `${time.ampm} ${time.hour}:${minute}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
  };

  if (loading || !selectedDay) return <div>Loading...</div>;

  return (
    <>
      <div
        className={`bg-white p-4 rounded-xl shadow-sm ${
          maxHeight ? "overflow-y-auto" : ""
        }`}
        style={maxHeight ? { maxHeight } : {}}
      >
        <div className="font-semibold mb-3">
          {formatDate(selectedDay.date)}
        </div>

        {selectedDay.todos.map((todo) => {
          const isEditing = editingId === todo.id;
          const displayTime = formatTime(todo.time);

          return (
            <div key={todo.id} className="py-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => onToggleTodo(todo.id)}
                  className="custom-checkbox cursor-pointer"
                />

                <div className="flex-1">
                  {isEditing ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="input-box input-box--field w-full"
                      autoFocus
                      onMouseDown={stopBlur}
                    />
                  ) : (
                    <>
                      <span
                        className={`block ${
                          todo.done ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.title}
                      </span>

                      {todo.time && (
                        <span className="block text-sm text-gray-400 mt-1">
                          {displayTime}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {!isEditing && (
                  <Icon
                    icon="vaadin:ellipsis-dots-v"
                    width={14}
                    height={14}
                    className="text-[var(--color-light-gray)] rotate-90 cursor-pointer ml-2"
                    onClick={() => openActions(todo)}
                  />
                )}
              </div>

              {isEditing && (
                <div className="mt-3 pl-7 pr-2 flex flex-col gap-4">
                  <div
                    className="flex items-center justify-between"
                    onMouseDown={stopBlur}
                  >
                    <span className="text-sm text-gray-500">
                      시작 시간 설정
                    </span>
                    <Toggle
                      checked={showTimePicker}
                      onChange={setShowTimePicker}
                    />
                  </div>

                  {showTimePicker && (
                    <div onMouseDown={stopBlur}>
                      <WheelPickerTime
                        value={timeValue}
                        onChange={setTimeValue}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={cancelEditing}
                      className="flex-1 h-[48px] rounded-[12px] bg-gray-200 text-gray-700 font-semibold"
                    >
                      취소
                    </button>

                    <button
                      onClick={saveEditing}
                      className="flex-1 h-[48px] rounded-[12px] bg-[var(--color-opu-green)] text-white font-semibold"
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
