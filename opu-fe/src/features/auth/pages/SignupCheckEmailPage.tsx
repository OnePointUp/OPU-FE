"use client";

import OpuActionButton from "@/components/common/OpuActionButton";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCheckEmail } from "../hooks/useCheckEmail";

export default function EmailVerifyPage() {
    const params = useSearchParams();
    const email = params.get("email") ?? "";

    const { handleNext, handleResendEmail, isSending } = useCheckEmail({
        email,
    });

    return (
        <section className="overflow-hidden overscroll-none pt-8">
            {/* 메인 콘텐츠 */}
            <main>
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
                <div className="flex justify-center my-10">
                    <Image
                        src="/images/cabit_letter2.png"
                        alt="OPU mascot"
                        width={210}
                        height={210}
                        priority
                    />
                </div>

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
        </section>
    );
}
