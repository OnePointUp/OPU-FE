"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type Props = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
};

export default function PasswordInput({
    label,
    value,
    onChange,
    placeholder = "",
    error,
    className,
}: Props) {
    const [show, setShow] = useState(false);

    return (
        <section className="mt-6">
            <label
                className="block mb-2"
                style={{
                    fontSize: "var(--text-sub)",
                    fontWeight: "var(--weight-semibold)",
                    color: "var(--color-dark-navy)",
                }}
            >
                {label}
            </label>

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
                    style={{ color: "var(--color-light-gray)" }}
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

            {error ? (
                <p
                    className="mt-2 ml-1"
                    style={{
                        color: "var(--color-opu-red)",
                        fontSize: "var(--text-mini)",
                        fontWeight: "var(--weight-medium)",
                    }}
                >
                    {error}
                </p>
            ) : null}
        </section>
    );
}
