"use client";

import Spinner from "./Spinner";

interface MainButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "green" | "pink" | "dark" | "outline"; 
  fullWidth?: boolean;
  width?: number | string;
  className?: string;
}

export default function OpuButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = "green",
  fullWidth = false,
  width = 310, 
  className = "",
}: MainButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles = `
    flex items-center justify-center
    rounded-[16px]
    font-semibold
    text-[14px]
    h-[55px]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all
  `;

  const variants = {
    primary: "btn-primary",
    green: "bg-[var(--color-opu-green)] text-white",
    pink: "bg-[var(--color-opu-pink)] text-white",
    dark: "bg-[var(--color-dark-navy)] text-white",
    outline:
      "bg-white text-[var(--color-dark-gray)] border border-[var(--color-dark-gray)]",
  };

  return (
     <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      style={!fullWidth ? { width } : undefined}
      className={`
        ${variant === "primary" ? "btn-primary" : `${baseStyles} ${variants[variant]}`}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <Spinner />
      ) : (
        label
      )}
    </button>
  );
}
