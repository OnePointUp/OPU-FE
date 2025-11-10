"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import ProfileAvatarPicker from "@/features/user/components/ProfileAvatarPicker";
import NicknameField from "@/features/user/components/NicknameField";
import IntroField from "@/features/user/components/IntroField";
import { fetchMyProfile, type UserProfile } from "@/features/user/services";
import { checkNicknameDup, saveProfile } from "@/features/user/services";
import BottomActionBar from "@/components/common/BottomActionBar";

export default function ProfileEditPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [nickname, setNickname] = useState("");
    const [bio, setIntroduction] = useState("");
    const [dupError, setDupError] = useState<string>("");
    const [checking, setChecking] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const introMax = 500;

    useEffect(() => {
        fetchMyProfile()
            .then((data) => {
                setProfile(data);
                setNickname(data.nickname ?? "");
                setIntroduction(data.bio ?? "");
                setPreviewUrl(data.profileImageUrl ?? "");
            })
            .catch((err) => console.error("프로필 로드 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    // 닉네임 중복 체크
    async function handleBlurNickname() {
        // 프로필 정보 로드되기 전에는 중복 체크 X
        if (!profile) return;

        const v = nickname.trim();
        if (!v) {
            setDupError("닉네임을 입력해 주세요.");
            return;
        }

        setChecking(true);

        const current = profile?.nickname;
        const isDup = await checkNicknameDup(v, current);

        setChecking(false);
        setDupError(isDup ? "이미 존재하는 닉네임입니다." : "");
    }

    // 이미지 선택
    function handlePickImage(f: File) {
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    }

    const canSubmit =
        !checking &&
        !dupError &&
        nickname.trim().length > 0 &&
        bio.length <= introMax;

    async function handleSave() {
        if (!canSubmit) return;
        await saveProfile({
            nickname: nickname.trim(),
            bio,
            profileFile: file,
        });
        history.back();
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center bg-[var(--background)] justify-center">
                <p className="text-[var(--color-light-gray)]">
                    프로필 불러오는 중...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-[var(--background)]">
            <Header title="프로필 편집" showBack />
            <main
                className="w-full px-5 pb-40"
                style={{
                    width: "min(100%, var(--app-max))",
                    paddingTop: "calc(56px + var(--safe-top))",
                }}
            >
                <ProfileAvatarPicker
                    nickname={nickname}
                    previewUrl={previewUrl}
                    onPick={handlePickImage}
                />
                <NicknameField
                    value={nickname}
                    onChange={(v) => {
                        setNickname(v);
                        setDupError("");
                    }}
                    onBlurCheck={handleBlurNickname}
                    error={dupError}
                    checking={checking}
                />
                <IntroField
                    value={bio}
                    onChange={setIntroduction}
                    max={introMax}
                />
            </main>

            <BottomActionBar
                label="저장"
                disabled={!canSubmit}
                onClick={handleSave}
            />
        </div>
    );
}
