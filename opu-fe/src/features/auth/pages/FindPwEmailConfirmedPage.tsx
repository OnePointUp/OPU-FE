"use client";

import OpuActionButton from "@/components/common/OpuActionButton";
import { usePasswordEmailSent } from "@/features/auth/hooks/useFindPasswordEmailSent";

export default function PasswordEmailSentPage() {
    const { isSending, handleResendEmail, handleConfirm } =
        usePasswordEmailSent();

    return (
        <div className="app-page overflow-hidden overscroll-none">
            <main className="app-container pt-app-header pb-40 px-6 flex flex-col items-center gap-[22px]">
                {/* 설명 */}
                <div className="mt-[62px]">
                    <p
                        className="text-center"
                        style={{
                            font: "var(--text-sub)",
                            color: "var(--color-dark-gray)",
                            fontWeight: "var(--weight-semibold)",
                        }}
                    >
                        비밀번호 재설정 링크가
                        <br />
                        가입하신 이메일로 발송되었습니다.
                    </p>
                </div>

                {/* 확인 버튼 */}
                <OpuActionButton
                    label="확인"
                    onClick={handleConfirm}
                    positionFixed={false}
                    className="w-full"
                />

                {/* 이메일 재전송 */}
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
        </div>
    );
}
