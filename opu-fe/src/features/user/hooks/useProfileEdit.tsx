"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toastSuccess, toastError } from "@/lib/toast";
import { UserProfileDetail } from "../types";
import {
    editProfile,
    fetchProfileDetail,
    getProfileImagePresignedUrl,
} from "../services";
import { checkNicknameDup } from "@/utils/validation";
import { useProfileImagePicker } from "./useProfileImagePicker";

const INTRO_MAX = 500;

export function useProfileEdit() {
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfileDetail | null>(null);
    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");
    const [dupError, setDupError] = useState("");
    const [checking, setChecking] = useState(false);

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);

    const {
        profileImageUrl,
        file,
        handlePickImage,
        setProfileImageUrl,
        setFile,
    } = useProfileImagePicker();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProfileDetail();
                setProfile(data);
                setNickname(data.nickname ?? "");
                setBio(data.bio ?? "");
                setProfileImageUrl(data.profileImageUrl ?? "");
                setFile(null);
            } catch (e) {
                console.error("프로필 로드 실패", e);
                toastError("프로필 정보를 불러오지 못했어요.");
            } finally {
                setLoadingProfile(false);
            }
        };
        load();
    }, [setProfileImageUrl, setFile]);

    const handleBlurNickname = useCallback(async () => {
        if (!profile) return;

        const v = nickname.trim();
        if (!v) {
            setDupError("닉네임을 입력해주세요.");
            return;
        }

        setChecking(true);
        try {
            const current = profile.nickname;
            const isDup = await checkNicknameDup(v, current);
            setDupError(isDup ? "이미 존재하는 닉네임 입니다." : "");
        } catch (e) {
            console.error("닉네임 중복 체크 실패", e);
            toastError("닉네임 중복 체크에 실패했어요.");
        } finally {
            setChecking(false);
        }
    }, [nickname, profile]);

    const canSubmit =
        !saving &&
        !checking &&
        nickname.trim().length > 0 &&
        bio.length <= INTRO_MAX &&
        !dupError;

    const handleDeleteImage = useCallback(() => {
        setProfileImageUrl("");
        setFile(null);
    }, [setProfileImageUrl, setFile]);

    const handleSave = useCallback(async () => {
        if (!canSubmit) return;

        try {
            setSaving(true);

            let finalProfileImageUrl: string | null = profileImageUrl;

            if (file) {
                const mime = file.type || "image/jpeg";
                const ext = mime.startsWith("image/")
                    ? mime.split("/")[1] || "jpeg"
                    : "jpeg";

                const { uploadUrl, finalUrl } =
                    await getProfileImagePresignedUrl(ext);

                const contentType = `image/${ext}`;

                const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": contentType,
                    },
                });

                if (!uploadRes.ok) {
                    throw new Error("이미지 업로드 실패");
                }

                finalProfileImageUrl = finalUrl;
            }

            await editProfile({
                nickname: nickname.trim(),
                bio,
                profileImageUrl: finalProfileImageUrl ?? "",
            });

            toastSuccess("프로필 수정이 완료되었습니다!");
            router.back();
        } catch (err) {
            console.error("프로필 저장 실패:", err);
            toastError("프로필 저장에 실패했어요. 다시 시도해 주세요.");
        } finally {
            setSaving(false);
        }
    }, [bio, canSubmit, nickname, profileImageUrl, file, router]);

    return {
        nickname,
        bio,
        dupError,
        checking,
        profileImageUrl,
        loadingProfile,
        saving,
        introMax: INTRO_MAX,
        setNickname,
        setBio,
        handleBlurNickname,
        handleDeleteImage,
        handlePickImage,
        handleSave,
    };
}
