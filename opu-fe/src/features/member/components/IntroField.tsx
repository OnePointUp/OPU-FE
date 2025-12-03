"use client";

type Props = {
    value: string;
    onChange: (v: string) => void;
    max: number;
    className?: string;
};

export default function IntroField({
    value,
    onChange,
    max,
    className = "",
}: Props) {
    const len = value?.length ?? 0;

    return (
        <section className={`mt-6 ${className}`}>
            <label
                className="block my-1 mx-1"
                style={{
                    fontSize: "var(--text-sub)",
                    fontWeight: "var(--weight-semibold)",
                    color: "var(--color-dark-navy)",
                }}
            >
                자기소개
            </label>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="나를 멋지게 소개해 봐요 :)"
                rows={4}
                maxLength={max}
                className="input-box--textarea"
            />
            <div
                className="mt-1 mr-1 text-right"
                style={{
                    fontSize: "12px",
                    color: "var(--color-light-gray)",
                }}
            >
                {len}/{max}
            </div>
        </section>
    );
}
