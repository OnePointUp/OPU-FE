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
            <label className="form-label  block my-1 mx-1">자기소개</label>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="나를 멋지게 소개해 봐요 :)"
                rows={4}
                maxLength={max}
                className="input-box--textarea"
            />
            <div className="length-validation mt-1 mr-1 text-right">
                {len}/{max}
            </div>
        </section>
    );
}
