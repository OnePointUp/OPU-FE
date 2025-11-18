"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { validateEmail, requestPasswordReset } from "@/features/auth/services";
import { toastSuccess, toastError } from "@/lib/toast";

export function useFindPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // 이메일 입력 → 즉시 검증
  const handleEmailChange = useCallback((v: string) => {
    setEmail(v);
    setEmailError(validateEmail(v));
  }, []);

  const canSubmit = email.trim() && !emailError;

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      await requestPasswordReset(email.trim());
      toastSuccess("이메일을 전송하였습니다.");
      router.push("/find-pw/email-confirmed");
    } catch (e) {
      toastError(
        "이메일 전송 중 문제가 생겼습니다. 이메일 주소를 확인하거나 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  }, [canSubmit, loading, email, router]);

  return {
    email,
    emailError,
    loading,
    canSubmit,

    handleEmailChange,
    handleSubmit,
  };
}
