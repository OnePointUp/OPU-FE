"use client";

type Props = {
    label?: string;
    disabled?: boolean;
    onClick: () => void;
    className?: string;
};

export default function BottomActionBar({
    label = "저장",
    disabled,
    onClick,
    className = "",
}: Props) {
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
                    disabled={disabled}
                    className="btn-primary"
                    style={{
                        opacity: disabled ? 0.6 : 1,
                        background: disabled
                            ? "#DDE7C0"
                            : "var(--color-opu-green)",
                        color: "#fff",
                        fontSize: "var(--text-h3)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    {label}
                </button>
            </div>
        </div>
    );
}
