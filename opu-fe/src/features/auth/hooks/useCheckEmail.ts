"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { resendVerificationEmail } from "@/features/auth/services";
import { toastSuccess, toastError } from "@/lib/toast";

export function useEmailVerify() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  // 이메일 재전송
  const handleResendEmail = useCallback(async () => {
    try {
      setIsSending(true);
      await resendVerificationEmail();
      toastSuccess("이메일이 재전송 되었습니다.");
    } catch {
      toastError("이메일 재전송 중 문제가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSending(false);
    }
  }, []);

  // 다음 버튼
  const handleNext = useCallback(() => {
    router.push("/signup/email-confirmed");
  }, [router]);

  return {
    isSending,
    handleResendEmail,
    handleNext,
  };
}
