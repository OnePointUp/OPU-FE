"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type BottomSheetProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    showHandle?: boolean;
    maxWidth?: number;
    dismissThreshold?: number;
};

// 바깥 래퍼: open 아닐 땐 아예 마운트 안 함
export default function BottomSheet(props: BottomSheetProps) {
    if (!props.open) return null;
    return createPortal(<BottomSheetInner {...props} />, document.body);
}

function BottomSheetInner({
    onClose,
    children,
    showHandle = true,
    maxWidth = 480,
    dismissThreshold = 120,
}: Omit<BottomSheetProps, "open">) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    const startY = useRef<number | null>(null);
    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);

    // 바디 스크롤 잠금 (가로 이동 유발하는 paddingRight, left/right 설정 제거)
    useEffect(() => {
        const body = document.body;
        const scrollY = window.scrollY;

        const prev = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
        };

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);

            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.width = prev.width;
            body.style.overflow = prev.overflow;

            const y =
                parseInt((prev.top || "0").replace("-", ""), 10) || scrollY;
            window.scrollTo(0, y);
        };
    }, [onClose]);

    // 드래그 시작/이동/끝
    const beginDrag = (y: number) => {
        startY.current = y;
        setDragging(true);
        document.body.style.userSelect = "none";
    };

    const moveDrag = (y: number) => {
        if (!dragging || startY.current === null) return;
        const delta = y - startY.current;
        setDragY(delta > 0 ? delta : 0);
    };

    const endDrag = () => {
        if (!dragging) return;
        setDragging(false);
        document.body.style.userSelect = "";

        if (dragY >= dismissThreshold) {
            setDragY(window.innerHeight);
            setTimeout(onClose, 160); // 내려가는 애니메이션 후 닫기
        } else {
            setDragY(0);
        }
    };

    // 포인터(마우스/펜)
    const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        beginDrag(e.clientY);
    };
    const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) =>
        moveDrag(e.clientY);
    const onHandlePointerUp = () => endDrag();
    const onHandlePointerCancel = () => endDrag();

    // 터치(iOS/Android)
    useEffect(() => {
        const el = handleRef.current;
        if (!el) return;

        const tstart = (e: TouchEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                target?.closest("button,a,input,textarea,select,[data-no-drag]")
            )
                return;
            beginDrag(e.touches[0].clientY);
        };

        const tmove = (e: TouchEvent) => {
            if (!dragging) return;
            e.preventDefault();
            moveDrag(e.touches[0].clientY);
        };

        const tend = () => endDrag();

        el.addEventListener("touchstart", tstart, { passive: true });
        el.addEventListener("touchmove", tmove as EventListener, {
            passive: false,
        });
        el.addEventListener("touchend", tend, { passive: true });
        el.addEventListener("touchcancel", tend, { passive: true });

        return () => {
            el.removeEventListener("touchstart", tstart);
            el.removeEventListener("touchmove", tmove as EventListener);
            el.removeEventListener("touchend", tend);
            el.removeEventListener("touchcancel", tend);
        };
    }, [dragging]);

    const backdropOpacity = Math.max(0, 0.5 - Math.min(dragY, 300) / 600);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center"
            onClick={onClose}
        >
            {/* 백드롭 */}
            <div
                className="absolute inset-0 bg-black transition-opacity"
                style={{ opacity: backdropOpacity }}
            />

            {/* 시트 래퍼 */}
            <div
                className="absolute left-1/2 bottom-0 w-full"
                style={{ transform: "translateX(-50%)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    ref={sheetRef}
                    role="dialog"
                    aria-modal="true"
                    className="mx-auto rounded-t-2xl bg-white shadow-lg will-change-transform"
                    style={{
                        width: `min(100%, var(--app-max, ${maxWidth}px))`,
                        transform: `translate3d(0, ${dragY}px, 0)`,
                        transition: dragging
                            ? "none"
                            : "transform 180ms ease-out",
                    }}
                >
                    <div
                        ref={handleRef}
                        className="flex justify-center pt-3 pb-2 cursor-grab touch-none select-none"
                        onPointerDown={onHandlePointerDown}
                        onPointerMove={onHandlePointerMove}
                        onPointerUp={onHandlePointerUp}
                        onPointerCancel={onHandlePointerCancel}
                    >
                        {showHandle && (
                            <span className="block h-1.5 w-12 rounded-full bg-zinc-300" />
                        )}
                    </div>

                    <div
                        className="p-2"
                        style={{
                            touchAction: "pan-y",
                            WebkitOverflowScrolling: "touch",
                            maxHeight: "min(70vh, 640px)",
                            overflowY: "auto",
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
