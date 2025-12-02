"use client";

type Props = {
    value: string;
    onChange: (v: string) => void;
    className?: string;
};

export default function NicknameField({
    value,
    onChange,
    className = "",
}: Props) {
    return (
        <section className={`mt-6 ${className}`}>
            <label
                className="block mb-2 ml-1"
                style={{
                    fontSize: "var(--text-sub)",
                    fontWeight: "var(--weight-semibold)",
                    color: "var(--color-dark-navy)",
                }}
            >
                닉네임
            </label>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="닉네임을 입력하세요"
                className="input-box input-box--field"
            />

            {/* {error ? (
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
            ) : checking ? (
                <p
                    className="mt-2 ml-1"
                    style={{
                        color: "var(--color-light-gray)",
                        fontSize: "var(--text-mini)",
                    }}
                >
                    중복 확인 중...
                </p>
            ) : null} */}
        </section>
    );
}
