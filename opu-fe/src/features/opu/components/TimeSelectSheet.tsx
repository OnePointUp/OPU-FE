"use client";

import { Icon } from "@iconify/react";
import BottomSheet from "@/components/common/BottomSheet";
import { TIME_OPTIONS, TimeCode } from "../domain";

type Props = {
    open: boolean;
    selectedCode?: TimeCode;
    onClose: () => void;
    onSelect: (option: { code: TimeCode; label: string }) => void;
};

export default function TimeSelectSheet({
    open,
    selectedCode,
    onClose,
    onSelect,
}: Props) {
    return (
        <BottomSheet open={open} onClose={onClose}>
            <div className="-my-2">
                <div className="max-h-[min(70vh,480px)] overflow-y-auto bg-[var(--background)]">
                    <div className="sticky top-0 z-10 bg-[var(--background)] px-3 pt-2 pb-2">
                        <span
                            style={{
                                fontSize: "var(--text-sub)",
                                fontWeight: "var(--weight-semibold)",
                                color: "var(--color-dark-navy)",
                            }}
                        >
                            소요시간 선택
                        </span>
                    </div>
                    <ul>
                        {TIME_OPTIONS.filter((o) => o.code !== "ALL").map(
                            (opt, index) => {
                                const checked = opt.code === selectedCode;

                                return (
                                    <li
                                        key={opt.code}
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
                            }
                        )}
                    </ul>
                </div>
            </div>
        </BottomSheet>
    );
}
