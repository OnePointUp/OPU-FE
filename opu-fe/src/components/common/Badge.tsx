"use client";

type BadgeProps = {
    label: string;
    bg: string;
    color: string;

    height?: number;
    px?: number;
    radius?: number;
    fontSize?: string;
    className?: string;
};

export default function Badge({
    label,
    bg,
    color,
    height = 18,
    px = 4,
    radius = 6,
    fontSize = "var(--text-mini)",
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center justify-center font-medium leading-[16px] ${className}`}
            style={{
                backgroundColor: bg,
                color,
                height,
                padding: `0 ${px}px`,
                borderRadius: radius,
                fontSize,
            }}
        >
            {label}
        </span>
    );
}
