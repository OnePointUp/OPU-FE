"use client";

import { Icon } from "@iconify/react";

type Props = {
    value: string;
    onChange: (v: string) => void;
    className?: string;
};

const MIN_LEN = 2;
const MAX_LEN = 50;

export default function NicknameField({
    value,
    onChange,
    className = "",
}: Props) {
    const length = value.trim().length;
    const isSatisfied = length >= MIN_LEN && length <= MAX_LEN;

    return (
        <section className={`mt-6 ${className}`}>
            <label htmlFor="nickname-input" className="sr-only">
                닉네임
            </label>
            <input
                id="nickname-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="닉네임을 입력해주세요."
                className="input-box input-box--field"
            />

            <p
                className="flex items-center gap-0.5 mt-2"
                style={{
                    fontSize: "var(--text-validation)",
                    color: isSatisfied
                        ? "var(--color-opu-green)"
                        : "var(--color-light-gray)",
                    fontWeight: isSatisfied
                        ? "var(--weight-semibold)"
                        : "var(--weight-regular)",
                }}
            >
                <Icon icon="material-symbols:check" width="15" height="15" />
                2-50자리 이내
            </p>
        </section>
    );
}
