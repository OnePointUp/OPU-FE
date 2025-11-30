"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { requestEmailSignup } from "@/features/auth/services";

import { toastSuccess, toastError } from "@/lib/toast";
import { checkNicknameDup, validateEmail } from "@/utils/validation";

export function useSignupEmail() {
    const router = useRouter();

    const [profileImgUrl, setProfileImgUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [dupError, setDupError] = useState("");
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        marketing: false,
        notification: false,
    });

    const handlePickImage = useCallback((f: File) => {
        setFile(f);
        setProfileImgUrl(URL.createObjectURL(f));
    }, []);

    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);
        setEmailError(validateEmail(value));
    }, []);

    const handleBlurNickname = useCallback(async () => {
        const v = nickname.trim();
        if (!v) {
            setDupError("닉네임을 입력해 주세요.");
            return;
        }

        setChecking(true);
        try {
            const isDup = await checkNicknameDup(v);
            setDupError(isDup ? "이미 존재하는 닉네임입니다." : "");
        } catch {
            setDupError("닉네임 검사 중 오류가 발생했습니다.");
        } finally {
            setChecking(false);
        }
    }, [nickname]);

    const handleCheckAll = useCallback((checked: boolean) => {
        setAgreements({
            all: checked,
            terms: checked,
            privacy: checked,
            marketing: checked,
            notification: checked,
        });
    }, []);

    const handleCheckItem = useCallback(
        (key: keyof typeof agreements, checked: boolean) => {
            const next = { ...agreements, [key]: checked };
            next.all =
                next.terms &&
                next.privacy &&
                next.marketing &&
                next.notification;
            setAgreements(next);
        },
        [agreements]
    );

    const isPwMismatch =
        confirmPassword.length > 0 && password !== confirmPassword;

    const canSubmit =
        email.trim() &&
        !emailError &&
        password.trim() &&
        nickname.trim() &&
        !dupError &&
        !checking &&
        !isPwMismatch &&
        agreements.terms &&
        agreements.privacy;

    const handleSubmit = useCallback(async () => {
        if (!canSubmit) return;

        try {
            setLoading(true);

            await requestEmailSignup({
                email: email.trim(),
                password,
                nickname: nickname.trim(),
            });

            toastSuccess("인증용 이메일이 발송되었습니다.");
            router.push(
                `/signup/check-email?email=${encodeURIComponent(email)}`
            );
        } catch (err) {
            toastError(String(err) || "인증 이메일 발송 중 문제가 발생했어요.");
        } finally {
            setLoading(false);
        }
    }, [canSubmit, email, password, nickname, router]);

    return {
        profileImgUrl,
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
