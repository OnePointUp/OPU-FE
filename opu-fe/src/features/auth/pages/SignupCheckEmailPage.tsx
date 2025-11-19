"use client";

import OpuActionButton from "@/components/common/OpuActionButton";
import Image from "next/image";
import { useEmailVerify } from "@/features/auth/hooks/useCheckEmail";

export default function EmailVerifyPage() {
    const { isSending, handleResendEmail, handleNext } = useEmailVerify();

    return (
        <div className="app-page overflow-hidden overscroll-none">
            {/* 메인 콘텐츠 */}
            <main className="app-container pt-app-header pb-40 mt-14">
                {/* 안내 문구 */}
                <p
                    className="leading-relaxed text-center"
                    style={{
                        color: "var(--color-super-dark-gray)",
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-regular)",
                    }}
                >
                    이메일 인증을 위한 메일이 발송되었습니다.
                    <br />
                    회원가입 완료를 위한 이메일 인증을 진행해 주세요.
                </p>

                {/* 마스코트 이미지 */}
                <section className="flex justify-center my-10">
                    <Image
                        src="/images/cabit_letter2.png"
                        alt="OPU mascot"
                        width={210}
                        height={210}
                        priority
                    />
                </section>

                {/* 재전송 링크 */}
                <div className="text-center mb-8">
                    <button
                        onClick={handleResendEmail}
                        disabled={isSending}
                        style={{
                            color: "var(--color-light-gray)",
                            fontSize: "var(--text-caption)",
                        }}
                        className="underline disabled:opacity-50"
                    >
                        이메일을 받지 못하셨나요?
                    </button>
                </div>
            </main>

            {/* 하단 버튼 */}
            <OpuActionButton label="다음" onClick={handleNext} />
        </div>
    );
}
