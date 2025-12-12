"use client";

import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center bg-[var(--color-super-light-pink)]">
            <Image
                src="/images/random-opu-loading2.png"
                alt="loading"
                width={380}
                height={380}
                className="animate-bounce-slow object-contain"
                priority
            />

            <p
                style={{
                    fontSize: "var(--text-h3)",
                    fontFamily: "'Cafe24Oneprettynight', sans-serif",
                }}
            >
                랜덤 OPU를 고르는 중이에요
            </p>

            <div className="flex gap-5 mt-6">
                <span className="dot bg-[var(--color-opu-pink)]"></span>
                <span className="dot bg-[var(--color-opu-pink)]"></span>
                <span className="dot bg-[var(--color-opu-pink)]"></span>
            </div>
        </div>
    );
}
