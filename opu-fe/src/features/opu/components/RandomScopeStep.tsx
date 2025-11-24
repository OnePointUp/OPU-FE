"use client";

import OpuActionButton from "@/components/common/OpuActionButton";
import { toastWarn } from "@/lib/toast";

type Scope = "ALL" | "LIKED";
type ScopeValue = Scope | null;

type Props = {
    value: ScopeValue;
    onChange: (value: Scope) => void;
    onNext: () => void;
    canUseLiked: boolean;
    likedCount: number;
};

export default function RandomScopeStep({
    value,
    onChange,
    onNext,
    canUseLiked,
    likedCount,
}: Props) {
    return (
        <div className="w-full items-start px-3 py-5">
            {/* 설명 */}
            <p
                className="text-center text-[var(--color-dark-navy)] mb-5"
                style={{ fontSize: "var(--text-sub)" }}
            >
                범위를 선택해주세요
            </p>

            {/* 옵션 */}
            <div className="flex flex-col gap-3 w-full items-center">
                {/* 전체 */}
                <button
                    type="button"
                    onClick={() => onChange("ALL")}
                    style={{ fontSize: "var(--text-body)" }}
                    className={`w-full h-16 rounded-2xl border
                        ${
                            value === "ALL"
                                ? "border-[var(--color-opu-pink)] border-[2px] font-[var(--weight-medium)] text-[var(--color-opu-pink)] bg-[var(--color-super-light-pink)]"
                                : "border-[var(--color-super-dark-navy)] text-[var(--color-dark-navy)] bg-[--background]"
                        }`}
                >
                    전체
                </button>

                {/* 찜 목록 */}
                <button
                    type="button"
                    onClick={() => {
                        if (!canUseLiked) {
                            toastWarn(
                                "찜한 OPU가 없어요. 다른 옵션을 선택해주세요!"
                            );
                            return;
                        }
                        onChange("LIKED");
                    }}
                    className={`flex items-center justify-center gap-1 w-full h-16 rounded-2xl border
                        ${
                            value === "LIKED"
                                ? "border-[var(--color-opu-pink)] border-[2px] font-[var(--weight-medium)] text-[var(--color-opu-pink)] bg-[var(--color-super-light-pink)]"
                                : "border-[var(--color-super-dark-navy)] font-[var(--weight-semibold)]text-[var(--color-dark-navy)] bg-[--background]"
                        }`}
                    style={{ fontSize: "var(--text-body)" }}
                >
                    <span>찜 목록</span>
                    <span style={{ fontSize: "var(--text-sub)" }}>
                        {canUseLiked ? `(${likedCount})` : "(0)"}
                    </span>
                </button>
            </div>

            <OpuActionButton
                label="다음"
                disabled={!value}
                loading={false}
                onClick={onNext}
            />
        </div>
    );
}

export type { Scope, ScopeValue };
