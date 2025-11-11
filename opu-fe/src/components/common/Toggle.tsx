"use client";

type Props = {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
    id?: string;
};

export default function Toggle({ checked, onChange, disabled, id }: Props) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`relative inline-flex h-[30px] w-13 items-center rounded-full transition
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${
                    checked
                        ? "bg-[var(--color-toggle-on)]"
                        : "bg-[var(--color-toggle-off)]"
                }
              `}
        >
            <span
                className={`inline-block h-[24px] w-[24px] transform rounded-full bg-white transition
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
            />
        </button>
    );
}
