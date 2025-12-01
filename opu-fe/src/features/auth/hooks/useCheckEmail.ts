"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    resendVerificationEmail,
    fetchEmailVerifyStatus,
} from "@/features/auth/services";
import { toastSuccess, toastError } from "@/lib/toast";
import { extractErrorMessage } from "@/utils/api-helpers";

type UseEmailVerifyParams = {
    email: string;
};

export function useCheckEmail({ email }: UseEmailVerifyParams) {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);
    const [verified, setVerified] = useState(false);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (!email) {
            setVerified(false);
            return;
        }

        const check = async () => {
            try {
                setChecking(true);
                const current = await fetchEmailVerifyStatus(email);
                setVerified(current);
            } catch (err: unknown) {
                toastError(
                    extractErrorMessage(
                        err,
                        "이메일 인증 상태를 확인할 수 없습니다."
                    )
                );
            } finally {
                setChecking(false);
            }
        };

        void check();
    }, [email]);

    const handleResendEmail = useCallback(async () => {
        if (!email) {
            toastError("이메일 정보가 없습니다.");
            return;
        }

        try {
            setIsSending(true);
            await resendVerificationEmail(email);
            toastSuccess("이메일이 재전송 되었습니다.");
        } catch (err: unknown) {
            toastError(
                extractErrorMessage(
                    err,
                    "이메일 재전송 중 문제가 발생했습니다. 다시 시도해 주세요."
                )
            );
        } finally {
            setIsSending(false);
        }
    }, [email]);

    const handleNext = useCallback(async () => {
        if (!email) {
            toastError("이메일 정보가 없습니다.");
            return;
        }

        try {
            const current = await fetchEmailVerifyStatus(email);

            if (!current) {
                setVerified(false);
                toastError(
                    "이메일 인증이 아직 완료되지 않았어요. 메일함을 확인해 주세요."
                );
                return;
            }

            setVerified(true);
            toastSuccess("이메일 인증이 완료되었습니다!");
            router.replace("/signup/email-confirmed");
        } catch (err: unknown) {
            toastError(
                extractErrorMessage(
                    err,
                    "이메일 인증 상태를 확인할 수 없습니다."
                )
            );
        }
    }, [email, router]);

    return {
        isSending,
        checking,
        verified,
        handleResendEmail,
        handleNext,
    };
}
