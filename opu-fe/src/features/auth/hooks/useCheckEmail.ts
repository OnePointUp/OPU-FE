"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resendVerificationEmail } from "@/features/auth/services";
import { toastSuccess, toastError } from "@/lib/toast";

type UseEmailVerifyProps = {
    email: string;
    verified: boolean;
};

export function useEmailVerify({ email, verified }: UseEmailVerifyProps) {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);

    // 이메일 재전송
    const handleResendEmail = useCallback(async () => {
        if (!email) {
            toastError("이메일 정보가 없습니다.");
            return;
        }

        try {
            setIsSending(true);
            await resendVerificationEmail(email);
            toastSuccess("이메일이 재전송 되었습니다.");
        } catch {
            toastError(
                "이메일 재전송 중 문제가 발생했습니다. 다시 시도해 주세요."
            );
        } finally {
            setIsSending(false);
        }
    }, [email]);

    // 다음 버튼
    const handleNext = useCallback(() => {
        if (!verified) {
            toastError("이메일 인증을 먼저 완료해 주세요.");
            return;
        }
        router.push("/signup/email-confirmed");
    }, [router, verified]);

    return {
        isSending,
        handleResendEmail,
        handleNext,
    };
}
