"use client";

import BottomSheet from "@/components/common/BottomSheet";
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

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="p-4">

        <button
          className="w-full py-3 mb-2 text-agreement-optional"
          onClick={() => onEdit(todo)}
        >
          수정하기
        </button>

        <button
          className="w-full py-3 mb-2 text-agreement-optional"
          onClick={() => addRoutine(todo)}
        >
          루틴 추가
        </button>

        <button
          className="w-full py-3 mb-2 text-error-message"
          onClick={() => onDelete(todo)}
        >
          삭제하기
        </button>

      </div>
    </BottomSheet>
  );
}
