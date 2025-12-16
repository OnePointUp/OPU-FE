"use client";

import BottomSheet from "@/components/common/BottomSheet";
import ActionList, { type ActionItem } from "@/components/common/ActionList";
import type { Todo } from "@/features/todo/domain";

type Props = {
  open: boolean;
  todo: Todo | null;
  onClose: () => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  addRoutine: (todo: Todo) => void;
};

export default function TodoActionSheet({
  open,
  todo,
  onClose,
  onEdit,
  onDelete,
  addRoutine,
}: Props) {
  if (!todo) return null;

  const items: ActionItem[] = [
    { label: "수정하기", onClick: () => onEdit(todo) },
    ...(!todo.routineId
      ? [{ label: "루틴 추가", onClick: () => addRoutine(todo) }]
      : []),
    { label: "삭제하기", danger: true, onClick: () => onDelete(todo) },
  ];

  return (
    <BottomSheet open={open} onClose={onClose}>
      <ActionList items={items} />
    </BottomSheet>
  );
}
