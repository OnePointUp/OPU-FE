import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

import { extractErrorMessage } from "@/utils/api-helpers";
import {
    EmailSignupPayload,
    EmailVerifyStatusResponse,
    KakaoLoginResponse,
    LoginPayload,
    LoginResponse,
    ResetPasswordByTokenPayload,
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

// 이메일 인증여부 조회
export async function fetchEmailVerifyStatus(email: string): Promise<boolean> {
    const res = await apiClient.get<ApiResponse<EmailVerifyStatusResponse>>(
        "/auth/verify/status",
        {
            params: { email },
            skipAuth: true,
        }
    );

    return Boolean(res.data.data?.verified);
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
export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        payload,
        { skipAuth: true }
    );

    const data = res.data.data;

    useAuthStore.getState().setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        member: data.member,
    });

    console.log("auth store after login", useAuthStore.getState());

    return data;
}

// 로그아웃
export async function logout() {
    const { clearAuth } = useAuthStore.getState();

    try {
        await apiClient.post("/auth/logout");
    } catch (err) {
        console.error(
            "Logout request failed, client auth will still be cleared:",
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

// 카카오 로그인 요청
export async function requestKakaoLogin(
    code: string
): Promise<KakaoLoginResponse> {
    const res = await apiClient.get<ApiResponse<KakaoLoginResponse>>(
        "/auth/kakao/login",
        {
            params: { code },
            skipAuth: true,
        }
    );

    if (!res.data || !res.data.data) {
        throw new Error("카카오 로그인 응답 데이터가 유효하지 않습니다.");
    }

    return res.data.data;
}
