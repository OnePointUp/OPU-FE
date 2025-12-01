import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import {
    EditProfilePayload,
    PresignedUrlResponse,
    UserProfileDetail,
    UserProfileSummary,
} from "./types";
import { extractErrorMessage } from "@/utils/api-helpers";

/* ===== 프로필 요약 ===== */
export async function fetchProfileSummary(): Promise<UserProfileSummary> {
    const res = await apiClient.get<ApiResponse<UserProfileSummary>>(
        "/members/me/summary"
    );

    return res.data.data;
}

/* ===== 프로필 상세 ===== */
export async function fetchProfileDetail(): Promise<UserProfileDetail> {
    const res = await apiClient.get<ApiResponse<UserProfileDetail>>(
        "/members/me/profile"
    );

    return res.data.data;
}

/* ===== 프로필 수정 ===== */
export async function editProfile(payload: EditProfilePayload) {
    try {
        await apiClient.patch<
            UserProfileDetail | ApiResponse<UserProfileDetail>
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
