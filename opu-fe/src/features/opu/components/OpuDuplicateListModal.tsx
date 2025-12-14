"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

import { mapMinutesToLabel, toCategoryName } from "../domain";
import OpuActionButton from "@/components/common/OpuActionButton";

export type DuplicateOpuItem = {
    opuId: number;
    title: string;
    requiredMinutes: number;
    categoryId: number;
};

type Props = {
    open: boolean;
    duplicates: DuplicateOpuItem[];
    onSelectOpu: (opuId: number) => void;
    onCreatePrivate: () => void;
    onClose: () => void;
};

export default function OpuDuplicateListModal({
    open,
    duplicates,
    onSelectOpu,
    onCreatePrivate,
    onClose,
}: Props) {
    const [mounted, setMounted] = useState(false);
    const [selectedOpuId, setSelectedOpuId] = useState<number | null>(null);

    /* ESC 키 닫기 – ConfirmModal 동일 */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) {
            setMounted(true);
            document.addEventListener("keydown", handler);
        }

        return () => {
            document.removeEventListener("keydown", handler);
            setMounted(false);
            setSelectedOpuId(null);
        };
    }, [open, onClose]);

    if (!open || !mounted) return null;

    const hasSelection = selectedOpuId !== null;

    return createPortal(
        <div
            className="
                fixed inset-0 z-[10001]
                flex items-center justify-center
                bg-[var(--color-modal-bg)]
            "
            onClick={onClose}
        >
            {/* Modal Box (ConfirmModal과 동일한 개념) */}
            <div
                className="
                    w-[90%]
                    max-w-[420px]
                    max-h-[80vh]
                    rounded-2xl
                    bg-white
                    p-5
                    shadow-lg
                    flex flex-col
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title */}
                <h2 className="text-lg font-semibold text-center text-[var(--color-dark-navy)]">
                    비슷한 OPU가 있어요{" "}
                    <span className="text-sm text-[var(--color-dark-gray)]">
                        ({duplicates.length}개)
                    </span>
                </h2>

                <p className="mt-2 text-sm text-center text-[var(--color-dark-gray)]">
                    이미 공개된 OPU를 먼저 사용해보는 건 어때요?
                </p>

                {/* List */}
                <div className="mt-4 flex-1 overflow-y-auto space-y-3">
                    {duplicates.map((opu) => {
                        const isActive = selectedOpuId === opu.opuId;

                        return (
                            <button
                                key={opu.opuId}
                                onClick={() => setSelectedOpuId(opu.opuId)}
                                className={`
                                    relative w-full text-left
                                    rounded-xl border p-4 transition
                                    ${
                                        isActive
                                            ? "border-[var(--color-opu-green)]"
                                            : "border-[var(--color-input-border)]"
                                    }
                                `}
                            >
                                {isActive && (
                                    <Icon
                                        icon="mdi:check-circle"
                                        className="absolute top-3 right-3 text-[var(--color-opu-green)]"
                                        width={20}
                                        height={20}
                                    />
                                )}

                                <div className="font-medium text-[var(--color-dark-navy)]">
                                    {opu.title}
                                </div>
                                <div className="mt-1 text-xs text-[var(--color-dark-gray)]">
                                    {toCategoryName(opu.categoryId)} ·{" "}
                                    {mapMinutesToLabel(opu.requiredMinutes)}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                    <OpuActionButton
                        label="취소"
                        positionFixed={false}
                        onClick={onClose}
                        className="
                            flex-1
                            [&>button]:bg-[var(--color-super-light-gray)]
                            [&>button]:text-[var(--color-dark-gray)]
                        "
                    />

                    <OpuActionButton
                        label={
                            hasSelection
                                ? "이 OPU 사용하기"
                                : "비공개로 생성"
                        }
                        positionFixed={false}
                        onClick={() => {
                            if (hasSelection) {
                                onSelectOpu(selectedOpuId!);
                            } else {
                                onCreatePrivate();
                            }
                        }}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}
