"use client";

import { Icon } from "@iconify/react";

type Props = {
    value: string;
    onChange: (v: string) => void;
    className?: string;
    isLabeled?: boolean;
    error?: string;
};

export default function EmailField({
    value,
    onChange,
    className = "",
    error,
}: Props) {
    return (
        <section className={`mb-6 ${className}`}>
            <input
                type="email"
                placeholder="이메일을 입력해주세요."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-box input-box--field"
            />

            {error ? (
                <p
                    className="flex items-center gap-0.5 mt-2 text-[11px]"
                    style={{
                        color: "var(--color-opu-red)",
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
