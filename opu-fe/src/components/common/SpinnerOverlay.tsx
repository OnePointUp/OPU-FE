"use client";

export default function SpinnerOverlay() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <div className="w-6 h-6 border-2 border-[var(--color-opu-dark-pink-30)]/40 border-t-[var(--color-opu-dark-pink)] rounded-full animate-spin"></div>
        </div>
    );
}
