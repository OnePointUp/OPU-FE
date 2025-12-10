"use client";

import { useState, useEffect } from "react";
import { toastError } from "@/lib/toast";
import type { Todo } from "@/features/todo/domain";
import { useTodoTime } from "@/features/todo/hooks/useTodoTime";

export function useTodoEditing(
  selectedDay: { date: string; todos: Todo[] } | null,
  editingTodoId: number | null,
  onEditTodo: (
    todoId: number,
    newTitle: string,
    time: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => void,
  onConfirmNewTodo: (
    todoId: number,
    newTitle: string,
    time: { ampm: "AM" | "PM"; hour: number; minute: number } | null
  ) => void,
  onDeleteTodo: (todoId: number) => void
) {
  const { parse: parseTimeString } = useTodoTime(); // ✅ 중복 제거

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [isNewTodo, setIsNewTodo] = useState(false);

  const [timeValue, setTimeValue] = useState<{
    ampm: "AM" | "PM";
    hour: number;
    minute: number;
  }>({ ampm: "AM", hour: 9, minute: 0 });

  const [originalTime, setOriginalTime] = useState<{
    ampm: "AM" | "PM";
    hour: number;
    minute: number;
  } | null>(null);

  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!selectedDay || editingTodoId == null) return;

    const todo = selectedDay.todos.find((t) => t.id === editingTodoId);
    if (!todo) return;

    setEditingId(todo.id);
    setEditText(todo.title);
    setOriginalTitle(todo.title);

    const parsed = parseTimeString(todo.scheduledTime);
    setOriginalTime(parsed);

    if (parsed !== null) {
      setTimeValue(parsed);
      setShowTimePicker(true);
    } else {
      setShowTimePicker(false);
    }

    setIsNewTodo(todo.title === "");
  }, [editingTodoId, selectedDay]);

  useEffect(() => {
    setEditingId(null);
    setEditText("");
    setOriginalTitle("");
    setOriginalTime(null);
    setShowTimePicker(false);
    setIsNewTodo(false);
  }, [selectedDay?.date]);

  const save = () => {
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

  const cancel = () => {
    if (!editingId) return;

    if (isNewTodo) {
      onDeleteTodo(editingId);
    }

    setEditText(originalTitle);
    setTimeValue(originalTime ?? { ampm: "AM", hour: 9, minute: 0 });
    setShowTimePicker(originalTime !== null);
    setEditingId(null);
    setIsNewTodo(false);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);

    const parsed = parseTimeString(todo.scheduledTime);
    setOriginalTime(parsed);

    if (parsed !== null) {
      setTimeValue(parsed);
      setShowTimePicker(true);
    } else {
      setShowTimePicker(false);
    }

    setIsNewTodo(todo.title === "");
  };

  return {
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
  };
}
