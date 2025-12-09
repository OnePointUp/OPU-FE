"use client";

import OpuActionButton from "@/components/common/OpuActionButton";
import { toastWarn } from "@/lib/toast";
import { TIME_OPTIONS, TimeCode } from "../domain";

type TimeValue = TimeCode | null;

type Props = {
    value: TimeValue;
    onChange: (value: TimeCode) => void;
    onSubmit: () => void;
    timeCounts: Record<TimeCode, number>;
};

export default function RandomTimeStep({
    value,
    onChange,
    onSubmit,
    timeCounts,
}: Props) {
    return (
        <div className="w-full items-start px-3 py-5">
            {/* 설명 */}
            <p
                className="text-center text-[var(--color-dark-navy)] mb-5"
                style={{ fontSize: "var(--text-sub)" }}
            >
                시간을 선택해주세요
            </p>

            {/* 옵션 리스트 */}
            <div className="flex flex-col gap-3 w-full items-center">
                {TIME_OPTIONS.map((opt) => {
                    const isActive = value === opt.code;
                    const count = timeCounts[opt.code] ?? 0;
                    const isAvailable =
                        opt.code === "ALL" ? timeCounts.ALL > 0 : count > 0;

                    return (
                        <button
                            key={opt.code}
                            type="button"
                            onClick={() => {
                                if (!isAvailable) {
                                    toastWarn(
                                        "해당 시간의 OPU가 없어요. 다른 옵션을 골라주세요!"
                                    );
                                    return;
                                }
                                onChange(opt.code);
                            }}
                            style={{ fontSize: "var(--text-body)" }}
                            className={`flex items-center justify-center gap-1 w-full h-16 rounded-2xl border
                                ${
                                    isActive
                                        ? "border-[var(--color-opu-pink)] border-[2px] font-[var(--weight-medium)] text-[var(--color-opu-pink)] bg-[var(--color-super-light-pink)]"
                                        : "border-[var(--color-super-dark-navy)] text-[var(--color-dark-navy)] bg-[--background]"
                                }`}
                        >
                            <span>{opt.label}</span>
                            <span style={{ fontSize: "var(--text-sub)" }}>
                                ({count})
                            </span>
                        </button>
                    );
                })}
            </div>

            <OpuActionButton
                label="뽑기"
                disabled={!value}
                loading={false}
                onClick={onSubmit}
            />
        </div>
    );
}
