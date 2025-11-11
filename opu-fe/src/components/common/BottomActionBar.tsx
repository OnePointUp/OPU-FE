"use client";

import Spinner from "@/components/common/Spinner";

type Props = {
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
    className?: string;
};

export default function BottomActionBar({
    label = "저장",
    disabled,
    loading = false,
    onClick,
    className = "",
}: Props) {
    const isDisabled = disabled || loading;

    return (
        <div
            className={`fixed left-0 right-0 px-5 pt-3 pb-[max(16px,var(--safe-bottom))] flex justify-center ${className}`}
            style={{
                bottom: 0,
                width: "min(100%, var(--app-max))",
                margin: "0 auto",
                background: "var(--background)",
                position: "fixed",
            }}
        >
            <div style={{ position: "relative", width: "100%" }}>
                <button
                    type="button"
                    onClick={onClick}
                    disabled={isDisabled}
                    className="btn-primary flex justify-center items-center gap-2"
                    style={{ opacity: isDisabled ? 0.6 : 1 }}
                >
                    {loading ? (
                        <>
                            <Spinner />
                        </>
                    ) : (
                        label
                    )}
                </button>
            </div>
        </div>
    );
}
