import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import {
    EditProfilePayload,
    PresignedUrlResponse,
    MemberProfileDetail,
    MemberProfileSummary,
    PasswordCheckPayload,
} from "./types";
import { extractErrorMessage } from "@/utils/api-helpers";
import axios from "axios";

/* ===== 프로필 요약 ===== */
export async function fetchProfileSummary(): Promise<MemberProfileSummary> {
    const res = await apiClient.get<ApiResponse<MemberProfileSummary>>(
        "/members/me/summary"
    );

    return res.data.data;
}

/* ===== 프로필 상세 ===== */
export async function fetchProfileDetail(): Promise<MemberProfileDetail> {
    const res = await apiClient.get<ApiResponse<MemberProfileDetail>>(
        "/members/me/profile"
    );

    return res.data.data;
}

/* ===== 프로필 수정 ===== */
export async function editProfile(payload: EditProfilePayload) {
    try {
        await apiClient.patch<
            MemberProfileDetail | ApiResponse<MemberProfileDetail>
        >("/members/me/profile", {
            nickname: payload.nickname,
            bio: payload.bio,
            profileImageUrl: payload.profileImageUrl,
        });

        return { ok: true };
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "프로필 수정에 실패했어요."));
    }
}

/* ===== 프로필 이미지 등록 ===== */
export async function getProfileImagePresignedUrl(
    extension?: string
): Promise<PresignedUrlResponse> {
    const res = await apiClient.post<{
        data: PresignedUrlResponse;
    }>("/members/me/profile-image/presign", undefined, {
        params: extension ? { extension } : undefined,
    });

    return res.data.data;
}

/* ===== 회원 탈퇴 ===== */
export async function memberWithdraw(currentPassword: string) {
    try {
        await apiClient.delete("/members/me", {
            data: { currentPassword },
        });
    } catch (err: unknown) {
        throw new Error(extractErrorMessage(err, "회원 탈퇴를 실패했어요."));
    }
}

/* ===== 현재 비밀번호 검증 ===== */
export async function verifyCurrentPassword(password: string) {
    try {
        const payload: PasswordCheckPayload = { password };
        await apiClient.post("/auth/password/check", payload);
        return { ok: true };
    } catch (err: unknown) {
        // axios 에러 + 인증/권한 문제
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 401 || status === 403) {
                throw new Error(
                    err.response?.data?.message ??
                        "로그인이 필요합니다. 다시 로그인해 주세요."
                );
            }
        }

        throw new Error(
            extractErrorMessage(err, "비밀번호가 일치하지 않습니다.")
        );
    }
}
