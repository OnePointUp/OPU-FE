"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { requestEmailSignup } from "@/features/auth/services";

import { toastSuccess, toastError } from "@/lib/toast";
import { validateEmail } from "@/utils/validation";
import { useNicknameField } from "./useNicknameField";
import { useAgreements } from "./useAgreements";
import { useProfileImagePicker } from "@/features/member/hooks/useProfileImagePicker";
import { extractErrorMessage } from "@/utils/api-helpers";

export function useSignupEmail() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);

    const { nickname, setNickname, dupError, checking, handleBlurNickname } =
        useNicknameField();

    const { agreements, agreedRequired, handleCheckAll, handleCheckItem } =
        useAgreements();

    const { profileImageUrl, file, handlePickImage } = useProfileImagePicker();

    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);
        setEmailError(validateEmail(value));
    }, []);

    const isPwMismatch =
        confirmPassword.length > 0 && password !== confirmPassword;

    const webPushAgreed = agreements.webPush;

    const canSubmit =
        email.trim() &&
        !emailError &&
        password.trim() &&
        nickname.trim() &&
        !dupError &&
        !checking &&
        !isPwMismatch &&
        agreedRequired;

    const handleSubmit = useCallback(async () => {
        if (!canSubmit || loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        try {
            await requestEmailSignup({
                email: email.trim(),
                password,
                nickname: nickname.trim(),
                webPushAgreed,
            });

            toastSuccess("인증용 이메일이 발송되었습니다.");
            router.push(
                `/signup/check-email?email=${encodeURIComponent(email)}`
            );
        } catch (e) {
            toastError(
                extractErrorMessage(e, "인증 이메일 발송 중 문제가 발생했어요.")
            );
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [canSubmit, email, password, nickname, webPushAgreed, router]);

    return {
        profileImgUrl: profileImageUrl,
        file,
        email,
        emailError,
        password,
        confirmPassword,
        nickname,
        dupError,
        checking,
        loading,
        agreements,
        isPwMismatch,
        canSubmit,

        setPassword,
        setConfirmPassword,
        setNickname,
        handlePickImage,
        handleEmailChange,
        handleBlurNickname,
        handleCheckAll,
        handleCheckItem,
        handleSubmit,
    };
}
