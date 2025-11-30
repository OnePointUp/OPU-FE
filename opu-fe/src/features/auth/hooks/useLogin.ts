"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/features/auth/services";
import { login } from "@/features/auth/services";
import { toastSuccess, toastError } from "@/lib/toast";

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

            toastSuccess("로그인 완료!");
            router.replace("/");
        } catch (e) {
            const msg =
                e instanceof Error
                    ? e.message
                    : "이메일 또는 비밀번호를 다시 확인해주세요.";
            toastError(msg);
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
