"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/services";
import { toastSuccess, toastError } from "@/lib/toast";
import { validateEmail } from "@/utils/validation";
import { extractErrorMessage } from "@/utils/api-helpers";
import { fetchWebPushStatus } from "@/features/notification/services";

export function useLogin() {
    const router = useRouter();

    // 상태
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 이메일 입력 시 즉시 검증
    const handleEmailChange = useCallback((v: string) => {
        setEmail(v);
        setEmailError(validateEmail(v));
    }, []);

    // 로그인 가능 조건
    const canSubmit = email.trim() && password.trim() && !emailError;

    // 로그인 처리
    const handleSubmit = useCallback(async () => {
        if (!canSubmit || loading) return;

        try {
            setLoading(true);
            await login({ email: email.trim(), password });

            // 웹푸시 모달 노출 여부 동기화
            try {
                const status = await fetchWebPushStatus();

                if (status.webPushAgreed) {
                    // 이미 서비스 동의한 유저 -> 다시 안 뜨게
                    localStorage.setItem("opu_push_prompt_v1", "1");
                } else {
                    // 아직 동의 안 한 유저 -> 홈에서 모달 뜨게
                    localStorage.removeItem("opu_push_prompt_v1");
                }
            } catch {
                localStorage.setItem("opu_push_prompt_v1", "1");
            }

            toastSuccess("로그인 완료!");
            router.replace("/");
        } catch (e) {
            toastError(
                extractErrorMessage(
                    e,
                    "이메일 또는 비밀번호를 다시 확인해주세요."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [canSubmit, loading, email, password, router]);

    return {
        email,
        emailError,
        password,
        loading,
        canSubmit,

        setPassword,
        handleEmailChange,
        handleSubmit,
    };
}
