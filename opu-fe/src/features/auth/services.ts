import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

import { extractErrorMessage } from "@/utils/api-helpers";
import axios from "axios";
import {
    EmailSignupPayload,
    LoginPayload,
    PasswordCheckPayload,
    ResetPasswordByTokenPayload,
    TokenResponse,
} from "./types";
import { ApiResponse } from "@/types/api";

// 이메일 회원가입 요청
export async function requestEmailSignup(payload: EmailSignupPayload) {
    try {
        await apiClient.post("/auth/register", payload, { skipAuth: true });
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "회원가입에 실패했어요."));
    }
}

// 이메일 재전송
export async function resendVerificationEmail(email: string) {
    try {
        await apiClient.post(
            "/auth/verify/resend",
            { email },
            { skipAuth: true }
        );
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "인증 메일 재전송에 실패했어요.")
        );
    }
}

// 로그인 + JWT 저장
export async function login(payload: LoginPayload) {
    try {
        const res = await apiClient.post<ApiResponse<TokenResponse>>(
            "/auth/login",
            payload,
            { skipAuth: true }
        );

        const tokenData = res.data.data;

        useAuthStore.getState().setAuth({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
        });

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "이메일 또는 비밀번호를 확인해 주세요.")
        );
    }
}

// 로그아웃
export async function logout() {
    const { clearAuth } = useAuthStore.getState();

    try {
        await apiClient.post("/auth/logout");
    } catch (err) {
        console.error(
            "Logout server request failed, but client state cleared:",
            err
        );
    } finally {
        clearAuth();
    }
}

// 비밀번호 재설정 - 링크 요청
export async function requestPasswordReset(email: string) {
    try {
        await apiClient.post(
            "/auth/password/reset-request",
            { email },
            { skipAuth: true }
        );
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "비밀번호 재설정 메일 전송에 실패했어요.")
        );
    }
}

// 비밀번호 재설정 메일 재전송
export async function resendPasswordEmail() {
    try {
        await apiClient.post("/auth/password/reset-resend", undefined, {
            skipAuth: true,
        });
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(
                err,
                "비밀번호 재설정 메일 재전송에 실패했어요."
            )
        );
    }
}

// 비밀번호 재설정(토큰 기반)
export async function resetPasswordByToken(
    payload: ResetPasswordByTokenPayload
) {
    try {
        await apiClient.post("/auth/password/reset", payload, {
            skipAuth: true,
        });
        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(
                err,
                "비밀번호 재설정에 실패했어요. 링크를 다시 확인해 주세요."
            )
        );
    }
}

// 현재 비밀번호 검증
export async function verifyCurrentPassword(password: string) {
    try {
        const payload: PasswordCheckPayload = { password };
        await apiClient.post("/auth/password/check", payload);
        return { ok: true };
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            // 인증/권한 문제
            if (status === 401 || status === 403) {
                throw new Error(
                    err.response?.data?.message ??
                        "로그인이 필요합니다. 다시 로그인해 주세요."
                );
            }

            // 그 외 (진짜 비밀번호 불일치 등)
            throw new Error(
                err.response?.data?.message ?? "비밀번호가 일치하지 않습니다."
            );
        }

        throw new Error("비밀번호 확인 중 오류가 발생했어요.");
    }
}

// 비밀번호 변경
export async function changePassword(
    currentPassword: string,
    newPassword: string
) {
    try {
        await apiClient.post("/auth/password/change", {
            oldPassword: currentPassword,
            newPassword,
        });

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(
            extractErrorMessage(err, "비밀번호 변경에 실패했어요.")
        );
    }
}
