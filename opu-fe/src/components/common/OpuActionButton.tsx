"use client";

import Spinner from "@/components/common/Spinner";

type Props = {
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    positionFixed?: boolean;
    onClick: () => void;
    className?: string;
};

export default function BottomActionBar({
    label = "저장",
    disabled,
    loading = false,
    positionFixed = true,
    onClick,
    className = "",
}: Props) {
    const isDisabled = disabled || loading;

    return (
        <div
            className={
                positionFixed
                ? `fixed left-0 right-0 bottom-0 px-5 pt-3 pb-[max(16px,var(--safe-bottom))] flex justify-center bg-[var(--background)] ${className}`
                : `${className}`
            }
            style={
                positionFixed
                ? { width: "min(100%, var(--app-max))", margin: "0 auto" }
                : undefined
            }
            >
            <button
                type="button"
                onClick={onClick}
                disabled={isDisabled}
                className={`
                w-full
                flex items-center justify-center
                h-[55px]
                rounded-[16px]
                font-semibold
                text-[14px]
                transition-all
                bg-[var(--color-opu-green)] text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {loading ? <Spinner /> : label}
            </button>
        </div>
    );
}
