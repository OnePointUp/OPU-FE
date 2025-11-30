import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/api";
import {
    EditProfilePayload,
    UserProfileDetail,
    UserProfileSummary,
} from "./types";
import { extractErrorMessage } from "@/utils/api-helpers";

export async function fetchProfileSummary(): Promise<UserProfileSummary> {
    const res = await apiClient.get<ApiResponse<UserProfileSummary>>(
        "/members/me/summary"
    );

    return res.data.data;
}

export async function fetchProfileDetail(): Promise<UserProfileDetail> {
    const res = await apiClient.get<ApiResponse<UserProfileDetail>>(
        "/members/me/profile"
    );

    return res.data.data;
}

// --- 프로필 수정 ---

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
