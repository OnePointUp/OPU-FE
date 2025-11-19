"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

type Props =
    | { label: string; href: string; onClick?: never; disabled?: boolean }
    | { label: string; onClick: () => void; href?: never; disabled?: boolean };

export default function SettingRow({ label, href, onClick, disabled }: Props) {
    const cls =
        "flex items-center justify-between h-13 w-full font-[var(--weight-semibold)] mx-1";
    const right = (
        <Icon
            icon="mdi:chevron-right"
            width={20}
            height={20}
            className="text-[var(--color-light-gray)] mx-1.5"
        />
    );

    if (href) {
        return (
            <Link
                href={href}
                className={cls}
                style={{ fontSize: "var(--text-sub)" }}
                aria-disabled={disabled}
            >
                <span
                    className={disabled ? "text-[var(--color-light-gray)]" : ""}
                >
                    {label}
                </span>
                {right}
            </Link>
        );
    }
    return (
        <button
            onClick={onClick}
            className={cls}
            style={{ fontSize: "var(--text-sub)" }}
            disabled={disabled}
            aria-disabled={disabled}
        >
            <span className={disabled ? "text-[var(--color-light-gray)]" : ""}>
                {label}
            </span>
            {right}
        </button>
    );
}
