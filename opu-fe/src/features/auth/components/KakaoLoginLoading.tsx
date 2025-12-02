"use client";

import Image from "next/image";

export default function KakaoLoginLoading() {
    return (
        <section className="flex min-h-[100svh] flex-col items-center justify-center gap-4">
            {/* 마스코트 / 일러스트 */}
            <div className="flex flex-col items-center gap-3">
                <Image
                    src="/images/cabit_hello.png"
                    alt="카카오 로그인 중인 OPU 캐릭터"
                    width={180}
                    height={180}
                    priority
                />
                <p
                    className="text-center"
                    style={{
                        color: "var(--color-dark-gray)",
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    카카오와 안전하게 연결 중이에요
                </p>
                <p
                    className="text-center"
                    style={{
                        color: "var(--color-light-gray)",
                        fontSize: "var(--text-caption)",
                    }}
                >
                    잠시만 기다려 주세요
                </p>
            </div>

            {/* 스피너 */}
            <div className="flex gap-2">
                <span className="dot bg-[var(--color-opu-pink)]"></span>
                <span className="dot bg-[var(--color-opu-pink)]"></span>
                <span className="dot bg-[var(--color-opu-pink)]"></span>
            </div>
        </section>
    );
}
