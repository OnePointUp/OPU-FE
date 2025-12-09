"use client";

import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";
import { useEffect, useState, MouseEvent } from "react";
import Toggle from "@/components/common/Toggle";
import WheelPickerTime from "./WheelPickerTime";
import { toastError } from "@/lib/toast";
import { useDragDrop } from "../hooks/useDragDrop";
import { useRouter } from "next/navigation";
import type { Todo } from "@/features/todo/domain";

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

  const [openSheet, setOpenSheet] = useState(false);
  const [targetTodo, setTargetTodo] = useState<Todo | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [timeValue, setTimeValue] = useState<{
    ampm: "AM" | "PM";
    hour: number;
    minute: number;
  }>({ ampm: "AM", hour: 9, minute: 0 });

  const [originalTitle, setOriginalTitle] = useState("");
  const [originalTime, setOriginalTime] = useState<{
    ampm: "AM" | "PM";
    hour: number;
    minute: number;
  } | null>(null);

  /** 신규 Todo 여부 flag */
  const [isNewTodo, setIsNewTodo] = useState(false);

  /* ------------------------------
     시간 문자열 → UI 구조 변환
  ------------------------------ */
  const parseTimeString = (timeStr: string | null) => {
    if (!timeStr) return null;

    let [hour, minute] = timeStr.split(":").map(Number);

    const ampm = (hour >= 12 ? "PM" : "AM") as "AM" | "PM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    return { ampm, hour, minute };
  };

  const stopBlur = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /* ------------------------------
     드래그 앤 드롭
  ------------------------------ */
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

  /* ------------------------------
     편집 시작
  ------------------------------ */
  useEffect(() => {
    if (!selectedDay || editingTodoId == null) return;

    const todo = selectedDay.todos.find((t) => t.id === editingTodoId);
    if (!todo) return;

    setEditingId(todo.id);
    setEditText(todo.title);
    setOriginalTitle(todo.title);

    const parsed = parseTimeString(todo.scheduledTime);
    setOriginalTime(parsed);
    setTimeValue(parsed ?? { ampm: "AM", hour: 9, minute: 0 });

    setShowTimePicker(parsed !== null);

    /** 신규 Todo 여부 판정 */
    setIsNewTodo(todo.title === "");
  }, [editingTodoId, selectedDay]);

  /* ------------------------------
     날짜 바뀌면 리셋
  ------------------------------ */
  useEffect(() => {
    setEditingId(null);
    setEditText("");
    setOriginalTitle("");
    setOriginalTime(null);
    setShowTimePicker(false);
    setOpenSheet(false);
    setIsNewTodo(false);
  }, [selectedDay?.date]);

  /* ------------------------------
     저장
  ------------------------------ */
  const saveEditing = () => {
    if (!editingId) return;

    const title = editText.trim();
    if (title === "") {
      toastError("제목은 비워둘 수 없습니다.");
      return;
    }

    const time = showTimePicker ? timeValue : null;

    if (isNewTodo) onConfirmNewTodo(editingId, title, time);
    else onEditTodo(editingId, title, time);

    setEditingId(null);
    setShowTimePicker(false);
    setIsNewTodo(false);
  };

  /* ------------------------------
     취소
  ------------------------------ */
  const cancelEditing = () => {
    if (!editingId) return;

    /** 신규 Todo일 경우에만 삭제 */
    if (isNewTodo) {
      onDeleteTodo(editingId);
    }

    /** 기존 Todo는 원래 값으로 복원 */
    setEditText(originalTitle);
    setTimeValue(originalTime ?? { ampm: "AM", hour: 9, minute: 0 });
    setShowTimePicker(!!originalTime);

    setEditingId(null);
    setIsNewTodo(false);
  };

  /* ------------------------------
     ActionSheet
  ------------------------------ */
  const openActions = (todo: Todo) => {
    setTargetTodo(todo);
    setOpenSheet(true);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);

    const parsed = parseTimeString(todo.scheduledTime);
    setOriginalTime(parsed);
    setTimeValue(parsed ?? { ampm: "AM", hour: 9, minute: 0 });

    setShowTimePicker(parsed !== null);
    setOpenSheet(false);
    setIsNewTodo(todo.title === "");
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;

    const parsed = parseTimeString(timeStr);
    if (!parsed) return null;

    const mm = String(parsed.minute).padStart(2, "0");
    return `${parsed.ampm} ${parsed.hour}:${mm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
  };

  /* ------------------------------
     Skeleton
  ------------------------------ */
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

  /* ------------------------------
     실제 렌더링
  ------------------------------ */
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
            아직 Todo가 없습니다.
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

              {/* 편집 UI */}
              {isEditing && (
                <div className="mt-3 flex flex-col gap-4">
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

      {/* 드래그 고스트 */}
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
        onClose={() => setOpenSheet(false)}
        onEdit={startEditing}
        addRoutine={(todo) => {
          if (!todo) return;
          router.push(
            `/routine/register?title=${encodeURIComponent(todo.title)}`
          );
          setOpenSheet(false);
        }}
        onDelete={(todo) => {
          onDeleteTodo(todo.id);
          setOpenSheet(false);
        }}
      />
    </>
  );
}
