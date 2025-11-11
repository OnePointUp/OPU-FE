"use client";

import Toggle from "./Toggle";

type Props = {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    help?: string;
    disabled?: boolean;
};

export default function SwitchRow({
    label,
    checked,
    onChange,
    help,
    disabled,
}: Props) {
    return (
        <div className="flex h-15 items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <span
                    className="text-[var(--color-dark-navy)]"
                    style={{
                        fontWeight: "var(--weight-regular)",
                        fontSize: "var(--text-body)",
                    }}
                >
                    {label}
                </span>
                {help ? (
                    <span
                        title={help}
                        className="grid place-items-center rounded-full text-[10px] w-4 h-4
                           bg-[var(--color-super-light-gray)] text-[var(--color-dark-gray)]"
                    >
                        ?
                    </span>
                ) : null}
            </div>

            <Toggle checked={checked} onChange={onChange} disabled={disabled} />
        </div>
    );
}
