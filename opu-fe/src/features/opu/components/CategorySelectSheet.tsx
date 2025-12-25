"use client";

import { Icon } from "@iconify/react";
import BottomSheet from "@/components/common/BottomSheet";
import { useOpuCategories } from "../hooks/useOpuCategories";

type Props = {
    open: boolean;
    selectedId?: number;
    onClose: () => void;
    onSelect: (option: { id: number; label: string }) => void;
};

export default function CategorySelectSheet({
    open,
    selectedId,
    onClose,
    onSelect,
}: Props) {
    const { categories, loading, error, refetch } = useOpuCategories();
    const options = categories.map((c) => ({ id: c.id, label: c.name }));

    return (
        <BottomSheet open={open} onClose={onClose}>
            {/* <div className="-my-2"> */}
            <div className="max-h-[min(70vh,480px)] overflow-y-auto bg-[var(--background)]">
                <div className="sticky top-0 z-10 bg-[var(--background)] px-3 pt-2 pb-2">
                    <span
                        style={{
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-semibold)",
                            color: "var(--color-dark-navy)",
                        }}
                    >
                        카테고리 선택
                    </span>
                </div>

                {/* 리스트 */}
                {loading ? (
                    <div className="px-3 py-4 text-[var(--color-light-gray)] text-[var(--text-sub)]">
                        카테고리를 불러오는 중이에요.
                    </div>
                ) : options.length === 0 ? (
                    <div className="px-3 py-4 text-[var(--color-light-gray)] text-[var(--text-sub)]">
                        표시할 카테고리가 없어요.
                    </div>
                ) : (
                    <ul>
                        {options.map((opt, index) => {
                            const checked = opt.id === selectedId;

                            return (
                                <li
                                    key={opt.id}
                                    className={
                                        index === 0
                                            ? "px-3 py-4 text-[var(--text-sub)]"
                                            : "px-3 py-4 text-[var(--text-sub)] border-t border-[var(--color-super-light-gray)]"
                                    }
                                >
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between cursor-pointer"
                                        onClick={() => {
                                            onSelect(opt);
                                            onClose();
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: checked
                                                    ? "var(--weight-semibold)"
                                                    : "var(--weight-regular)",
                                            }}
                                        >
                                            {opt.label}
                                        </span>

                                        {checked && (
                                            <Icon
                                                icon="ic:round-check"
                                                width={18}
                                                height={18}
                                                className="shrink-0"
                                                style={{
                                                    color: "var(--foreground)",
                                                }}
                                            />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
                {error && (
                    <div className="px-3 pb-3 text-[12px] text-[var(--color-opu-pink)]">
                        {error}{" "}
                        <button
                            type="button"
                            className="underline"
                            onClick={() => refetch()}
                        >
                            다시 시도
                        </button>
                    </div>
                )}
            </div>
            {/* </div> */}
        </BottomSheet>
    );
}
