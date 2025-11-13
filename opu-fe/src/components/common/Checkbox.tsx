"use client";

import { Icon } from "@iconify/react";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number; // 기본 24px
  disabled?: boolean;
  className?: string;
};

export default function Checkbox({
  checked,
  onChange,
  size = 20,
  disabled = false,
  className = "",
}: Props) {
  const borderRadius = Math.max(2, size * 0.2);

    const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`flex items-center justify-center transition-all duration-150 
        ${checked ? "bg-[var(--color-foreground)]" : "bg-white border border-gray-400"} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
        ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius,
      }}
    >
      {checked && (
        <Icon icon="ph:check-bold" width={size * 0.6} height={size * 0.6} color="white" />
      )}
    </button>
  );
}
