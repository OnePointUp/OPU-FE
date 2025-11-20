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

    useEffect(() => {
        const wrapper = document.querySelector(".app-page") as HTMLElement;
        const scrollY = window.scrollY;

        if (!wrapper) return;

        wrapper.style.position = "fixed";
        wrapper.style.top = `-${scrollY}px`;
        wrapper.style.left = "0";
        wrapper.style.right = "0";
        wrapper.style.overflow = "hidden";
        wrapper.style.width = "min(100%, var(--app-max))";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);

            wrapper.style.position = "";
            wrapper.style.top = "";
            wrapper.style.left = "";
            wrapper.style.right = "";
            wrapper.style.overflow = "";
            wrapper.style.width = "";

            window.scrollTo(0, scrollY);
        };
    }, [onClose]);

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
            setTimeout(onClose, 160);
        } else {
            setDragY(0);
        }
    };

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

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-end justify-center"
            onClick={onClose}
        >
            {/* 백드롭 */}
            <div className="absolute inset-0 bg-[var(--color-modal-bg)]" />

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
