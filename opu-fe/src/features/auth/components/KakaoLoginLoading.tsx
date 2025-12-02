"use client";

import Image from "next/image";

export default function KakaoLoginLoading() {
    return (
        <section className="flex flex-col gap-3 items-center justify-center mt-50">
            {/* 마스코트 / 일러스트 */}

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
            <div className="flex flex-col gap-3 items-center justify-center">
                <p
                    className="text-center"
                    style={{
                        color: "var(--color-light-gray)",
                        fontSize: "var(--text-caption)",
                    }}
                >
                    잠시만 기다려 주세요
                </p>

                {/* 스피너 */}
                <div className="flex gap-2">
                    <span className="dot bg-[var(--color-opu-pink)]"></span>
                    <span className="dot bg-[var(--color-opu-pink)]"></span>
                    <span className="dot bg-[var(--color-opu-pink)]"></span>
                </div>
            </div>
        </section>
    );
}
