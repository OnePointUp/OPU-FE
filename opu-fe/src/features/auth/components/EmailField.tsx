"use client";

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
  isLabeled = true,
  error
}: Props) {
  return (
    <section className={`mt-6 ${className}`}>
      {isLabeled && (
        <label
          className="block mb-2 ml-1"
          style={{
            fontSize: "var(--text-sub)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-dark-navy)",
          }}
        >
          이메일
        </label>
      )}

      <input
        type="email"
        placeholder="example@opu.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-box input-box--field"
      />

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
