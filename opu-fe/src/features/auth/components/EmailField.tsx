"use client";

import { Icon } from "@iconify/react";

type Props = {
    value: string;
    onChange: (v: string) => void;
    className?: string;
    isLabeled?: boolean;
    error?: string;
    placeholder?: string;
};

export default function EmailField({
    value,
    onChange,
    className = "",
    error,
    placeholder = "이메일을 입력해주세요.",
}: Props) {
    return (
        <section className={`mb-6 ${className}`}>
            <label htmlFor="email-input" className="sr-only">
                이메일
            </label>

            <input
                id="email-input"
                type="email"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-box input-box--field"
            />

            {error ? (
                <p
                    className="flex items-center gap-0.5 mt-2"
                    style={{
                        color: "var(--color-opu-red)",
                        fontSize: "var(--text-validation)",
                        fontWeight: "var(--weight-medium)",
                    }}
                >
                    <Icon
                        icon="material-symbols:close"
                        width="15"
                        height="15"
                    />
                    {error}
                </p>
            ) : null}
        </section>
    );
}
