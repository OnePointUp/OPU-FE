"use client";

type Props = {
    checked: boolean;
    onChange: (value: boolean) => void;
    className?: string;
};

export default function LikedOpuFilter({
    checked,
    onChange,
    className = "",
}: Props) {
    return (
        <div className={`${className}`}>
            <label
                className="inline-flex items-center gap-1.5"
                style={{
                    fontSize: "var(--text-caption)",
                    color: "var(--color-dark-gray)",
                }}
            >
                <input
                    type="checkbox"
                    className="custom-checkbox shrink-0"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span>찜한 OPU만 보기</span>
            </label>
        </div>
    );
}
