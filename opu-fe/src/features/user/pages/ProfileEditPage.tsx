"use client";

import ProfileAvatarPicker from "@/features/user/components/ProfileAvatarPicker";
import NicknameField from "@/features/user/components/NicknameField";
import IntroField from "@/features/user/components/IntroField";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useProfileEdit } from "@/features/user/hooks/useProfileEdit";

export default function ProfileEditPage() {
    const {
        nickname,
        bio,
        dupError,
        checking,
        profileImgUrl,
        saving,
        introMax,
        setNickname,
        setBio,
        handleBlurNickname,
        handlePickImage,
        handleSave,
    } = useProfileEdit();

    const canSubmit =
        !saving &&
        !checking &&
        nickname.trim().length > 0 &&
        bio.length <= introMax &&
        !dupError;

    return (
        <div className="app-page overflow-hidden overscroll-none mx-2">
            <main className="app-container pt-app-header pb-40">
                <ProfileAvatarPicker
                    nickname={nickname}
                    previewUrl={profileImgUrl}
                    onPick={handlePickImage}
                />
                <NicknameField
                    value={nickname}
                    onChange={(v) => {
                        setNickname(v);
                    }}
                    onBlurCheck={handleBlurNickname}
                    error={dupError}
                    checking={checking}
                />
                <IntroField value={bio} onChange={setBio} max={introMax} />
            </main>

            <OpuActionButton
                label="저장"
                disabled={!canSubmit}
                loading={saving}
                onClick={handleSave}
            />
        </div>
    );
}
