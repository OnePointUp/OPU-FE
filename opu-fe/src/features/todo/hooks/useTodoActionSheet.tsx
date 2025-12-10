"use client";

import { useState } from "react";
import type { Todo } from "@/features/todo/domain";

export function useTodoActionSheet(startEditing: (todo: Todo) => void) {
  const [openSheet, setOpenSheet] = useState(false);
  const [targetTodo, setTargetTodo] = useState<Todo | null>(null);

  const openActions = (todo: Todo) => {
    setTargetTodo(todo);
    setOpenSheet(true);
  };

  const closeActions = () => setOpenSheet(false);

  const editFromActions = (todo: Todo) => {
    startEditing(todo);
    closeActions();
  };

  return {
    openSheet,
    targetTodo,
    openActions,
    closeActions,
    editFromActions,
  };
}
