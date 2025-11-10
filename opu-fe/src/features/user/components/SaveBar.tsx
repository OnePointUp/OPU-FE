"use client";

type Props = {
    disabled?: boolean;
    onSave: () => void;
};

export default function SaveBar({ disabled, onSave }: Props) {
    return (
        <div
            className="fixed px-5 pt-2"
            style={{
                width: "min(100%, var(--app-max))",
                bottom: 0,
                background: "transparent",
            }}
        >
            <button
                type="button"
                onClick={onSave}
                disabled={disabled}
                className="btn-primary"
                style={{ opacity: disabled ? 0.5 : 1 }}
            >
                저장
            </button>
        </div>
    );
}
