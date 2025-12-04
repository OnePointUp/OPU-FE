"use client";

import type { DailyTodoStats } from "@/mocks/api/db/calendar.db";
import { Icon } from "@iconify/react";
import TodoActionSheet from "./TodoActionSheet";
import { useEffect, useState, MouseEvent } from "react";
import Toggle from "@/components/common/Toggle";
import WheelPickerTime from "./WheelPickerTime";
import { toastError } from "@/lib/toast";
import { useDragDrop } from "../hooks/useDragDrop";
import { useRouter } from "next/navigation";

/* ------------------------------------------------
   Skeleton 스타일을 위한 Tailwind 유틸 클래스
   ------------------------------------------------ */
const skeleton = "bg-gray-200 rounded animate-pulse";

/* ------------------------------------------------
   컴포넌트 시작
   ------------------------------------------------ */
type Props = {
    selectedDay: DailyTodoStats | null;
    onToggleTodo: (todoId: number) => void;
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
    const [openSheet, setOpenSheet] = useState(false);
    const [targetTodo, setTargetTodo] = useState<
        DailyTodoStats["todos"][number] | null
    >(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [timeValue, setTimeValue] = useState({
        ampm: "AM" as "AM" | "PM",
        hour: 9,
        minute: 0,
    });

    const [originalTitle, setOriginalTitle] = useState("");
    const [originalTime, setOriginalTime] = useState<{
        ampm: "AM" | "PM";
        hour: number;
        minute: number;
    } | null>(null);

    const router = useRouter();

    /* -----------------------------------------------
     드래그 앤 드롭 훅 적용
     ----------------------------------------------- */
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

    /* -----------------------------------------------
     신규 Todo 편집 시작
     ----------------------------------------------- */
    useEffect(() => {
        if (!selectedDay) return;
        if (editingTodoId == null) return;

        const todo = selectedDay.todos.find((t) => t.id === editingTodoId);
        if (!todo) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditingId(todo.id);
        setEditText(todo.title);
        setOriginalTitle(todo.title);
        setOriginalTime(todo.time ?? null);

        if (todo.time) {
            setShowTimePicker(true);
            setTimeValue(todo.time);
        } else {
            setShowTimePicker(false);
            setTimeValue({ ampm: "AM", hour: 9, minute: 0 });
        }
    }, [editingTodoId, selectedDay]);

    /* -----------------------------------------------
     날짜 바뀌면 편집 초기화
     ----------------------------------------------- */
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditingId(null);
        setEditText("");
        setOriginalTitle("");
        setOriginalTime(null);
        setShowTimePicker(false);
        setOpenSheet(false);
    }, [selectedDay?.date]);

    const stopBlur = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    /* -----------------------------------------------
     저장 처리
     ----------------------------------------------- */
    const saveEditing = () => {
        if (!editingId) return;

        const title = editText.trim();
        if (title === "") {
            toastError("제목은 비워둘 수 없습니다.");
            return;
        }

        const time = showTimePicker ? timeValue : null;
        const isNewTodo = originalTitle === "";

        if (isNewTodo) onConfirmNewTodo(editingId, title, time);
        else onEditTodo(editingId, title, time);

        setEditingId(null);
        setShowTimePicker(false);
    };

    /* -----------------------------------------------
     취소 처리
     ----------------------------------------------- */
    const cancelEditing = () => {
        if (!editingId) return;

        const isNewTodo = originalTitle === "";
        if (isNewTodo) onDeleteTodo(editingId);

        setEditText(originalTitle);
        setTimeValue(originalTime ?? { ampm: "AM", hour: 9, minute: 0 });
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
            setTimeValue({ ampm: "AM", hour: 9, minute: 0 });
        }

        setOpenSheet(false);
    };

    const formatTime = (time: DailyTodoStats["todos"][0]["time"]) => {
        if (!time) return null;
        const minute = String(time.minute).padStart(2, "0");
        return `${time.ampm} ${time.hour}:${minute}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const weekday = ["일", "월", "화", "수", "목", "금", "토"][
            date.getDay()
        ];
        return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
    };

    /* ------------------------------------------------
     ⭐ 스켈레톤 UI (로딩 or selectedDay 없음)
     ------------------------------------------------ */
    if (loading || !selectedDay) {
        return (
            <div
                className={`bg-white p-4 rounded-xl shadow-sm ${
                    maxHeight ? "overflow-y-auto" : ""
                }`}
                style={maxHeight ? { maxHeight } : {}}
            >
                {/* 날짜 스켈레톤 */}
                <div className={`h-5 w-32 ${skeleton} mb-4`} />

                {/* Todo 스켈레톤 3개 */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 mb-6">
                        {/* 체크박스 자리 */}
                        <div className={`w-5 h-5 rounded ${skeleton}`} />

                        {/* 텍스트 자리 */}
                        <div className="flex-1">
                            <div className={`h-4 w-40 ${skeleton} mb-2`} />
                            <div className={`h-3 w-24 ${skeleton}`} />
                        </div>

                        {/* 메뉴 버튼 자리 */}
                        <div className={`w-4 h-4 ${skeleton}`} />
                    </div>
                ))}
            </div>
        );
    }

    /* ------------------------------------------------
     실제 렌더링 영역
     ------------------------------------------------ */
    return (
        <>
            <div
                className={`w-full bg-white px-5 py-4 rounded-xl border border-[var(--color-super-light-gray)] ${
                    maxHeight ? "overflow-y-auto" : ""
                }`}
                style={maxHeight ? { maxHeight } : {}}
            >
                <div className="font-semibold mb-3">
                    {formatDate(selectedDay.date)}
                </div>

                {reorderedItems.map((todo, index) => {
                    const isEditing = editingId === todo.id;
                    const displayTime = formatTime(todo.time);

                    const hiddenWhileDragging =
                        isDragging && dragItem && dragItem.id === todo.id
                            ? "opacity-0"
                            : "";

                    return (
                        <div
                            key={todo.id}
                            className={`py-4 transition-opacity ${hiddenWhileDragging}`}
                            {...(!isEditing ? bindItemEvents(todo, index) : {})}
                        >
                            <div className="flex items-center gap-2">
                                {!isEditing && (
                                    <input
                                        type="checkbox"
                                        checked={todo.done}
                                        onChange={() => onToggleTodo(todo.id)}
                                        className="custom-checkbox cursor-pointer"
                                    />
                                )}

                                <div className="flex-1">
                                    {isEditing ? (
                                        <input
                                            value={editText}
                                            onChange={(e) =>
                                                setEditText(e.target.value)
                                            }
                                            className="input-box input-box--field w-full"
                                            autoFocus
                                            onMouseDown={stopBlur}
                                        />
                                    ) : (
                                        <>
                                            <span
                                                className={`block ${
                                                    todo.done
                                                        ? "line-through text-gray-400"
                                                        : ""
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

            {/* 드래그 고스트 UI */}
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
                    const encoded = encodeURIComponent(todo.title);
                    router.push(`/routine/register?title=${encoded}`);
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
