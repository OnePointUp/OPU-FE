"use client";

import Toggle from "../../../components/common/Toggle";

type Props = {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    help?: string;
    disabled?: boolean;
};

export default function ToggleRow({
    label,
    description,
    checked,
    onChange,
    disabled,
}: Props) {
    return (
        <div className="flex items-center justify-between px-2 py-3">
            {/* 왼쪽 텍스트 영역 */}
            <div className="min-w-0 flex-1">
                <p
                    className="text-[var(--color-dark-navy)] truncate"
                    style={{
                        fontWeight: "var(--weight-regular)",
                        fontSize: "var(--text-body)",
                    }}
                >
                    {label}
                </p>

                {description && (
                    <p
                        className="text-[var(--color-dark-gray)] truncate"
                        style={{
                            fontWeight: "var(--weight-regular)",
                            fontSize: "var(--text-caption)",
                        }}
                        title={description}
                    >
                        {description}
                    </p>
                )}
            </div>

            <Toggle checked={checked} onChange={onChange} disabled={disabled} />
        </div>
    );
}
