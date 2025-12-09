"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

import { reorderTodo } from "@/features/todo/service";

type AnyMouseEvent = MouseEvent | ReactMouseEvent;
type AnyTouchEvent = TouchEvent | ReactTouchEvent;

type Position = { clientX: number; clientY: number };

export type UseDragDropResult<T> = {
  items: T[];
  isDragging: boolean;
  dragItem: T | null;
  ghostStyle: CSSProperties;
  bindItemEvents: (
    item: T,
    index: number
  ) => {
    ref: (el: HTMLDivElement | null) => void;
    onMouseDown: (e: ReactMouseEvent) => void;
    onTouchStart: (e: ReactTouchEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchEnd: () => void;
  };
};

export function useDragDrop<T extends { id: number }>(
  initialItems: T[],
  onChange: (items: T[]) => void
): UseDragDropResult<T> {
  const [items, setItems] = useState<T[]>(initialItems ?? []);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragItem, setDragItem] = useState<T | null>(null);
  const [ghostStyle, setGhostStyle] = useState<CSSProperties>({});

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pressTimer = useRef<number | null>(null);
  const offsetY = useRef(0);

  /** initialItems 변경 반영 */
  useEffect(() => {
    setItems(initialItems ?? []);
  }, [initialItems]);

  /** 롱프레스 시작 */
  const startLongPress = (
    item: T,
    index: number,
    e: ReactMouseEvent | ReactTouchEvent
  ) => {
    if (pressTimer.current !== null) clearTimeout(pressTimer.current);

    pressTimer.current = window.setTimeout(() => {
      startDrag(item, index, e);
    }, 130);
  };

  const cancelLongPress = () => {
    if (pressTimer.current !== null) clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  /** 드래그 시작 */
  const startDrag = (
    item: T,
    index: number,
    e: ReactMouseEvent | ReactTouchEvent
  ) => {
    setIsDragging(true);
    setDragIndex(index);
    setDragItem(item);

    const { clientY } = getPos(e);
    const rect = itemRefs.current[index]?.getBoundingClientRect();
    if (!rect) return;

    offsetY.current = clientY - rect.top;

    setGhostStyle({
      position: "fixed",
      top: clientY - offsetY.current,
      left: rect.left,
      width: rect.width,
      opacity: 0.85,
      pointerEvents: "none",
      zIndex: 9999,
    });
  };

  /** 드래그 이동 처리 */
  const handleMove = (e: AnyMouseEvent | AnyTouchEvent) => {
    if (!isDragging) return;

    const { clientY } = getPos(e);

    setGhostStyle((prev) => ({
      ...prev,
      top: clientY - offsetY.current,
    }));

    handleHover(clientY);
  };

  /** hover 중 순서 계산 */
  const handleHover = (clientY: number) => {
    if (dragIndex === null) return;

    const hoverIndex = itemRefs.current.findIndex((ref) => {
      if (!ref) return false;
      const rect = ref.getBoundingClientRect();
      return clientY >= rect.top && clientY <= rect.bottom;
    });

    if (hoverIndex === -1 || hoverIndex === dragIndex) return;

    setItems((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      return updated;
    });

    setDragIndex(hoverIndex);
  };

  /** 드래그 종료 */
  const drop = async () => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragIndex(null);

    if (dragItem) {
      onChange(items);

      for (let i = 0; i < items.length; i++) {
        const todo = items[i];
        const newOrder = i + 1;
        try {
          await reorderTodo(todo.id, newOrder);
        } catch (err) {
          console.error("Todo 정렬 저장 실패", err);
        }
      }
    }
  };

  /** 전역 move/end 이벤트 등록 */
  useEffect(() => {
    if (!isDragging) return;

    const moveHandler = (e: any) => handleMove(e);
    const endHandler = () => drop();

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("mouseup", endHandler);
    window.addEventListener("touchend", endHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("mouseup", endHandler);
      window.removeEventListener("touchend", endHandler);
    };
  }, [isDragging, items]);

  /** UI 이벤트 */
  const bindItemEvents = (item: T, index: number) => ({
    ref: (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
    },
    onMouseDown: (e: ReactMouseEvent) => startLongPress(item, index, e),
    onTouchStart: (e: ReactTouchEvent) => startLongPress(item, index, e),
    onMouseUp: cancelLongPress,
    onMouseLeave: cancelLongPress,
    onTouchEnd: cancelLongPress,
  });

  return {
    items,
    isDragging,
    dragItem,
    ghostStyle,
    bindItemEvents,
  };
}

/** PC/모바일 공통 좌표 처리 */
function getPos(e: AnyMouseEvent | AnyTouchEvent): Position {
  if ("touches" in e && e.touches.length)
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };

  return {
    clientX: (e as AnyMouseEvent).clientX,
    clientY: (e as AnyMouseEvent).clientY,
  };
}
