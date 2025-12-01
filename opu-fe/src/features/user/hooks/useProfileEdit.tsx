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

const INTRO_MAX = 500;

export function useProfileEdit() {
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfileDetail | null>(null);
    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");
    const [dupError, setDupError] = useState("");
    const [checking, setChecking] = useState(false);

    const [profileImageUrl, setProfileImgUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProfileDetail();
                setProfile(data);
                setNickname(data.nickname ?? "");
                setBio(data.bio ?? "");
                setProfileImgUrl(data.profileImageUrl ?? "");
            } catch (e) {
                console.error("프로필 로드 실패", e);
                toastError("프로필 정보를 불러오지 못했어요.");
            } finally {
                setLoadingProfile(false);
            }
        };
        load();
    }, []);

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

    // 사진 선택: 파일만 기억 + 미리보기용 URL
    const handlePickImage = useCallback((f: File) => {
        setFile(f);
        setProfileImgUrl(URL.createObjectURL(f));
    }, []);

    const canSubmit =
        !saving &&
        !checking &&
        nickname.trim().length > 0 &&
        bio.length <= INTRO_MAX &&
        !dupError;

    const handleSave = useCallback(async () => {
        if (!canSubmit) return;

        try {
            setSaving(true);

            let finalProfileImageUrl: string | null = profileImageUrl || null;

            // 새 파일 선택된 경우에만 S3 업로드
            if (file) {
                const mime = file.type || "image/jpeg";
                const ext = mime.startsWith("image/")
                    ? mime.split("/")[1] || "jpeg"
                    : "jpeg";

                // presigned URL 발급
                const { uploadUrl, finalUrl } =
                    await getProfileImagePresignedUrl(ext);

                const contentType = `image/${ext}`;

                // S3 업로드
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

                // CloudFront 최종 URL 저장
                finalProfileImageUrl = finalUrl;
            }

            // 프로필 업데이트
            await editProfile({
                nickname: nickname.trim(),
                bio,
                profileImageUrl: finalProfileImageUrl,
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
        handlePickImage,
        handleSave,
    };
}
