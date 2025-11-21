"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SocialLoginButton from "@/features/auth/components/SocialLoginButton";

export default function IntroPage() {
    const router = useRouter();

    return (
        <section className="overflow-hidden overscroll-none">
            <div className="flex flex-col justify-between min-h-screen pb-app-bottom">
                {/* ---------- 상단: 로고 & 문구 ---------- */}
                <header className="flex flex-col gap-3 items-center text-center">
                    <h1 className="text-h1 font-bold text-[color:var(--color-dark-navy)] text-[length:var(--text-h1)]">
                        OPU
                    </h1>
                    <p className="text-sub text-[var(--color-dark-gray)]">
                        One Point Up!
                        <br />한 걸음씩, 오늘도 나아가기
                    </p>
                </header>

                {/* ---------- 중앙: 캐릭터 ---------- */}
                <div className="flex justify-center">
                    <Image
                        src="/images/cabit_hello.png"
                        alt="OPU mascot"
                        width={250}
                        height={250}
                        priority
                    />
                </div>

                {/* ---------- 하단: 버튼 영역 ---------- */}
                <footer className="flex flex-col gap-2 items-center w-full">
                    <SocialLoginButton
                        provider="kakao"
                        onClick={() => router.push("/social-signup")}
                    />
                    <SocialLoginButton
                        provider="google"
                        onClick={() => router.push("/social-signup")}
                    />

                    {/* 이메일 로그인 / 회원가입 */}
                    <div className="text-center text-[length:var(--text-caption)] text-[color:var(--color-light-gray)] mt-2">
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => router.push("/login")}
                        >
                            이메일로 로그인
                        </span>
                        {"  |  "}
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => router.push("/signup")}
                        >
                            회원가입
                        </span>
                    </div>
                </footer>
            </div>
        </section>
    );
}
