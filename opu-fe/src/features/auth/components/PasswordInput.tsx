"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type PasswordRule = {
    label: string;
    satisfied: boolean;
};

type Props = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    rules?: PasswordRule[];
    statusLabel?: string;
    statusActive?: boolean;
};

export default function PasswordInput({
    value,
    onChange,
    placeholder = "",
    rules,
    statusLabel,
    statusActive,
}: Props) {
    const [show, setShow] = useState(false);

    return (
        <section className="mb-6">
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="input-box input-box--field pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]"
                    aria-label={show ? "비밀번호 가리기" : "비밀번호 보기"}
                    style={{ color: "var(--color-placeholder)" }}
                >
                    {show ? (
                        <Icon
                            icon="basil:eye-closed-outline"
                            width="24"
                            height="24"
                        />
                    ) : (
                        <Icon icon="basil:eye-outline" width="24" height="24" />
                    )}
                </button>
            </div>

            {/* 조건 (영문포함 / 숫자포함 / 8~20자) */}
            {rules && rules.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {rules.map((rule) => (
                        <span
                            key={rule.label}
                            className="flex items-center gap-0.5"
                            style={{
                                fontSize: "var(--text-validation)",
                                color: rule.satisfied
                                    ? "var(--color-opu-green)"
                                    : "var(--color-light-gray)",
                                fontWeight: rule.satisfied
                                    ? "var(--weight-semibold)"
                                    : "var(--weight-regular)",
                            }}
                        >
                            <Icon
                                icon="material-symbols:check"
                                width="15"
                                height="15"
                            />
                            {rule.label}
                        </span>
                    ))}
                </div>
            )}

            {/* 비밀번호 일치 */}
            {statusLabel && (
                <p
                    className="flex gap-0.5 mt-2"
                    style={{
                        fontSize: "var(--text-validation)",
                        color: statusActive
                            ? "var(--color-opu-green)"
                            : "var(--color-light-gray)",
                        fontWeight: statusActive
                            ? "var(--weight-semibold)"
                            : "var(--weight-regular)",
                    }}
                >
                    <Icon
                        icon="material-symbols:check"
                        width="15"
                        height="15"
                    />
                    {statusLabel}
                </p>
            )}
        </section>
    );
}
