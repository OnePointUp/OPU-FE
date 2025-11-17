"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/toast";
import { resendPasswordEmail } from "@/features/auth/services";

export function usePasswordEmailSent() {
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);

  /** 이메일 재전송 */
  const handleResendEmail = useCallback(async () => {
    try {
      setIsSending(true);
      await resendPasswordEmail();
      toastSuccess("이메일이 재전송되었습니다.");
    } catch (e) {
      toastError("이메일 재전송 중 문제가 생겼습니다. 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  }, []);

  /** 확인 버튼 → 로그인 이동 */
  const handleConfirm = useCallback(() => {
    toastSuccess("비밀번호가 재설정 되었습니다.");
    router.push("/login");
  }, [router]);

  return {
    isSending,
    handleResendEmail,
    handleConfirm,
  };
}
