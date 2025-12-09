"use client";

import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";
import { MouseEvent } from "react";
import Toggle from "@/components/common/Toggle";
import WheelPickerTime from "../../main/components/WheelPickerTime";
import { useDragDrop } from "../../main/hooks/useDragDrop";
import { useRouter } from "next/navigation";
import type { Todo } from "@/features/todo/domain";

import { useTodoEditing } from "@/features/todo/hooks/useTodoEditing";
import { useTodoActionSheet } from "@/features/todo/hooks/useTodoActionSheet";
import { useTodoTime } from "@/features/todo/hooks/useTodoTime";

const skeleton = "bg-gray-200 rounded animate-pulse";

type SelectedDayData = {
  date: string;
  todos: Todo[];
};

type Props = {
  selectedDay: SelectedDayData | null;
  onToggleTodo: (todoId: number, completed: boolean) => void;
  onEditTodo: (
    todoId: number,
    newTitle: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => void;
  onDeleteTodo: (todoId: number) => void;
  onConfirmNewTodo: (
    todoId: number,
    newTitle: string,
    time?: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => void;
  editingTodoId: number | null;
  loading?: boolean;
  maxHeight?: number;
};

export default function TodoList({
  selectedDay,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  onConfirmNewTodo,
  editingTodoId,
  loading = false,
  maxHeight,
}: Props) {
  const router = useRouter();

  const {
    editingId,
    editText,
    setEditText,
    showTimePicker,
    setShowTimePicker,
    timeValue,
    setTimeValue,
    save,
    cancel,
    startEditing,
  } = useTodoEditing(
    selectedDay,
    editingTodoId,
    onEditTodo,
    onConfirmNewTodo,
    onDeleteTodo
  );

  const {
    openSheet,
    targetTodo,
    openActions,
    closeActions,
    editFromActions,
  } = useTodoActionSheet(startEditing);

  const { formatTime } = useTodoTime();

  const stopBlur = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const {
    items: reorderedItems,
    bindItemEvents,
    dragItem,
    isDragging,
    ghostStyle,
  } = useDragDrop(selectedDay ? selectedDay.todos : [], (updated) => {
    if (selectedDay) {
      selectedDay.todos.splice(0, selectedDay.todos.length, ...updated);
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
  };

  if (loading || !selectedDay) {
    return (
      <div
        className={`bg-white p-4 rounded-xl shadow-sm ${
          maxHeight ? "overflow-y-auto" : ""
        }`}
        style={maxHeight ? { maxHeight } : {}}
      >
        <div className={`h-5 w-32 ${skeleton} mb-4`} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 mb-6">
            <div className={`w-5 h-5 rounded ${skeleton}`} />
            <div className="flex-1">
              <div className={`h-4 w-40 ${skeleton} mb-2`} />
              <div className={`h-3 w-24 ${skeleton}`} />
            </div>
            <div className={`w-4 h-4 ${skeleton}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full bg-white px-5 py-4 rounded-xl border border-[var(--color-super-light-gray)] ${
          maxHeight ? "overflow-y-auto" : ""
        }`}
        style={maxHeight ? { maxHeight } : {}}
      >
        <div
          className="mb-2"
          style={{
            fontSize: "var(--text-sub)",
            fontWeight: "var(--weight-semibold)",
          }}
        >
          {formatDate(selectedDay.date)}
        </div>

        {reorderedItems.length === 0 && (
          <div
            className="w-full py-10 text-center text-[var(--color-light-gray)]"
            style={{ fontSize: "var(--text-sub)" }}
          >
            Todo가 없습니다.
          </div>
        )}

        {reorderedItems.map((todo, index) => {
          const isEditing = editingId === todo.id;
          const displayTime = formatTime(todo.scheduledTime);
          const hiddenWhileDragging =
            isDragging && dragItem && dragItem.id === todo.id
              ? "opacity-0"
              : "";

          return (
            <div
              key={todo.id}
              className={`py-2 transition-opacity ${hiddenWhileDragging}`}
              {...(!isEditing ? bindItemEvents(todo, index) : {})}
            >
              <div className="flex items-start gap-3">
                {!isEditing && (
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id, !todo.completed)}
                    className="custom-checkbox cursor-pointer mt-1"
                  />
                )}

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
                          todo.completed
                            ? "line-through text-[var(--color-light-gray)]"
                            : "text-[var(--color-dark-navy)]"
                        }`}
                        style={{ fontSize: "var(--text-sub)" }}
                      >
                        {todo.title}
                      </span>

                      {todo.scheduledTime && (
                        <span
                          className="block"
                          style={{
                            color: "var(--color-light-gray)",
                            fontSize: "var(--text-validation)",
                          }}
                        >
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
                <div className="mt-3 flex flex-col gap-4">
                  <div
                    className="flex items-center justify-between"
                    onMouseDown={stopBlur}
                  >
                    <span className="text-sm text-gray-500">시작 시간 설정</span>
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
                      onClick={cancel}
                      className="flex-1 h-[48px] rounded-[12px] bg-gray-200 text-gray-700 font-semibold"
                    >
                      취소
                    </button>

                    <button
                      onClick={save}
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

      {isDragging && dragItem && (
        <div
          className="fixed z-[9999] pointer-events-none shadow-lg rounded-xl bg-white px-4 py-3"
          style={ghostStyle}
        >
          <div className="font-semibold">{dragItem.title}</div>
        </div>
      )}

      <TodoActionSheet
        open={openSheet}
        todo={targetTodo}
        onClose={closeActions}
        onEdit={editFromActions}
        addRoutine={(todo) => {
          if (!todo) return;
          router.push(
            `/routine/register?title=${encodeURIComponent(todo.title)}`
          );
          closeActions();
        }}
        onDelete={(todo) => {
          onDeleteTodo(todo.id);
          closeActions();
        }}
      />
    </>
  );
}
