"use client";

type Variant = "success" | "error" | "warn" | "info";

export default function ToastCard({
    message,
    variant = "success",
}: {
    message: string;
    variant?: Variant;
}) {
    const iconClass =
        variant === "success"
            ? "var(--toast-success)"
            : variant === "error"
            ? "var(--toast-error)"
            : variant === "warn"
            ? "var(--toast-warn)"
            : "var(--toast-info)";

    return (
        <div className={`toast-card is-${variant}`} role="status">
            <span className={`toast-icon ${iconClass}`} aria-hidden>
                {variant === "success" && (
                    <svg width="18" height="18" viewBox="0 0 20 20">
                        <circle
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M6.5 10.5l2.5 2.5L13.5 8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
                {variant === "error" && (
                    <svg width="18" height="18" viewBox="0 0 20 20">
                        <circle
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M7 7l6 6M13 7l-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                )}
                {variant === "warn" && (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                            d="M12 3l9 16H3l9-16z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M12 9v5M12 18h.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                )}
                {variant === "info" && (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <line
                            x1="12"
                            y1="7"
                            x2="12"
                            y2="9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <line
                            x1="12"
                            y1="12"
                            x2="12"
                            y2="16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                )}
            </span>

            <p style={{ flex: 1, marginRight: 8 }}>{message}</p>
        </div>
    );
}
