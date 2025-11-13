"use client";

import { useEffect } from "react";

type ConfirmModalProps = {
    isOpen: boolean;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    isOpen,
    message = "삭제하시겠습니까?",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
        if (isOpen) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-modal-bg)]"
            onClick={onCancel}
        >
            <div
                className="w-[80%] max-w-sm rounded-2xl bg-white p-5 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <p
                    className="text-center text-[var(--color-super-dark-gray)] whitespace-pre-line leading-snug font-[var(--weight-medium)]"
                    style={{ fontSize: "var(--text-sub)" }}
                >
                    {message}
                </p>

                <div className="flex justify-center gap-2 mt-5">
                    <button
                        onClick={onCancel}
                        className="w-1/2 h-10 rounded-md bg-[var(--color-super-light-gray)] text-[var(--color-dark-gray)] font-[var(--weight-semibold)]"
                        style={{ fontSize: "var(--text-sub)" }}
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-1/2 h-10 rounded-md bg-[var(--color-opu-dark-green)] text-white font-[var(--weight-semibold)]"
                        style={{ fontSize: "var(--text-sub)" }}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
