"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toastSuccess, toastError } from "@/lib/toast";
import { AuthMember, useAuthStore } from "@/stores/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api";
import { useProfileImagePicker } from "@/features/user/hooks/useProfileImagePicker";
import { useNicknameField } from "./useNicknameField";
import { useAgreements } from "./useAgreements";

type KakaoRegisterResponse = {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expiresInSeconds?: number;
    refreshExpiresInSeconds?: number;
    member?: AuthMember;
};

export function useSocialSignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [saving, setSaving] = useState(false);

    const { nickname, setNickname, dupError, checking, handleBlurNickname } =
        useNicknameField();

    const { agreements, agreedRequired, handleCheckAll, handleCheckItem } =
        useAgreements();

    const { profileImageUrl, file, handlePickImage } = useProfileImagePicker();

    // 제출 가능 조건
    const canSubmit =
        !saving &&
        nickname.trim().length > 0 &&
        !dupError &&
        !checking &&
        agreedRequired;

    // 제출
    const handleSubmit = useCallback(async () => {
        if (!canSubmit) return;

        const providerId = searchParams.get("providerId");
        if (!providerId) {
            toastError(
                "소셜 로그인 정보가 없습니다. 처음부터 다시 시도해 주세요."
            );
            router.replace("/welcome");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                providerId,
                nickname: nickname.trim(),
                profileImageUrl: "", // 나중에 프로필 편집에서 업로드
            };

            const res = await apiClient.post<
                ApiResponse<KakaoRegisterResponse>
            >("/auth/kakao/register", payload, {
                skipAuth: true,
            });

            const data: KakaoRegisterResponse = res.data?.data ?? {};

            // 3) 토큰 내려오면 authStore에 저장
            if (data.accessToken && data.refreshToken && data.member) {
                useAuthStore.getState().setAuth({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    member: data.member,
                });
            }

            toastSuccess("회원가입이 완료되었습니다.");

            if (data.accessToken && data.refreshToken) {
                router.replace("/");
            } else {
                router.replace("/signup/email-confirmed");
            }
        } catch (e) {
            console.error("소셜 회원가입 실패:", e);
            toastError("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setSaving(false);
        }
    }, [canSubmit, nickname, searchParams, router]);

    return {
        nickname,
        dupError,
        checking,
        profileImgUrl: profileImageUrl,
        file,
        agreements,
        canSubmit,
        saving,

        setNickname,
        handleBlurNickname,
        handlePickImage,
        handleCheckAll,
        handleCheckItem,
        handleSubmit,
    };
}
