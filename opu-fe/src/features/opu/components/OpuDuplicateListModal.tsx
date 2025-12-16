"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

import { mapMinutesToLabel, toCategoryName } from "../domain";
import OpuActionButton from "@/components/common/OpuActionButton";
import type { OpuDuplicateItem as DuplicateOpuItem } from "@/features/opu/domain";
import { useOpuCategories } from "../hooks/useOpuCategories";

type Mode = "create" | "share";

type Props = {
    open: boolean;
    mode: Mode;
    duplicates: DuplicateOpuItem[];

    /** 선택한 OPU를 처리 (create면 “이 OPU 사용하기”, share면 “오늘 투두에 추가”) */
    onSelectOpu: (opuId: number) => void | Promise<void>;

    /** create 모드에서만 의미 있음: 내 OPU를 비공개로 생성 */
    onCreatePrivate?: () => void | Promise<void>;

    onClose: () => void;
};

export default function OpuDuplicateListModal({
    open,
    mode,
    duplicates,
    onSelectOpu,
    onCreatePrivate,
    onClose,
}: Props) {
    const { categoryMap } = useOpuCategories();

    const [mounted, setMounted] = useState(false);
    const [selectedOpuId, setSelectedOpuId] = useState<number | null>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMounted(true);
            document.addEventListener("keydown", handler);
        }

        return () => {
            document.removeEventListener("keydown", handler);
            setMounted(false);
            setSelectedOpuId(null);
        };
    }, [open, onClose]);

    const description = useMemo(() => {
        if (mode === "create") {
            return (
                <>
                    이미 공개된 OPU가 있어요.
                    <br />
                    선택해서 <b>오늘 할 일</b>에 추가하거나,{" "}
                    <b>비공개로 생성</b>할 수 있어요.
                </>
            );
        }

        return (
            <>
                이미 공개된 OPU를 먼저 사용해보는 건 어때요?
                <br />
                선택한 OPU를 <b>오늘 할 일</b>로 바로 추가할 수 있어요.
            </>
        );
    }, [mode]);

    if (!open || !mounted) return null;

    const hasSelection = selectedOpuId !== null;

    const rightLabel =
        mode === "create"
            ? hasSelection
                ? "이 OPU 사용하기"
                : "비공개로 생성"
            : "오늘 할 일에 추가";

    // share 모드에서는 선택 필수(버튼 disabled)
    const rightDisabled = mode === "share" ? !hasSelection : false;

    return createPortal(
        <div
            className="
        fixed inset-0 z-[10001]
        flex items-center justify-center
        bg-[var(--color-modal-bg)]
      "
            onClick={onClose}
        >
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
                <h2 className="text-lg font-semibold text-center text-[var(--color-dark-navy)]">
                    비슷한 OPU가 있어요{" "}
                    <span className="text-sm text-[var(--color-dark-gray)]">
                        ({duplicates.length}개)
                    </span>
                </h2>

                <p className="mt-2 text-sm text-center text-[var(--color-dark-gray)]">
                    {description}
                </p>

                <div className="mt-4 flex-1 overflow-y-auto space-y-3">
                    {duplicates.map((opu) => {
                        const isActive = selectedOpuId === opu.opuId;

                        return (
                            <button
                                key={opu.opuId}
                                onClick={() =>
                                    setSelectedOpuId((prev) =>
                                        prev === opu.opuId ? null : opu.opuId
                                    )
                                }
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
                                    {toCategoryName(opu.categoryId, categoryMap)}{" "}
                                    ·{" "}
                                    {mapMinutesToLabel(opu.requiredMinutes)}
                                </div>
                            </button>
                        );
                    })}
                </div>

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
                        label={rightLabel}
                        positionFixed={false}
                        disabled={rightDisabled}
                        onClick={async () => {
                            if (mode === "create") {
                                if (hasSelection) {
                                    await onSelectOpu(selectedOpuId!);
                                } else {
                                    await onCreatePrivate?.();
                                }
                                return;
                            }

                            // mode === "share"
                            if (!hasSelection) return;
                            await onSelectOpu(selectedOpuId!);
                        }}
                        className={`
              flex-1
              ${rightDisabled ? "[&>button]:opacity-50" : ""}
            `}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}
