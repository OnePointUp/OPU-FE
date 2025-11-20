"use client";

import NicknameField from "@/features/user/components/NicknameField";
import AgreementsField from "@/features/auth/components/AgreementsField";
import OpuActionButton from "@/components/common/OpuActionButton";
import ProfileAvatarPicker from "@/features/user/components/ProfileAvatarPicker";
import { useSocialSignupForm } from "@/features/auth/hooks/useSocialSignup";

export default function SocialSignupPage() {
    const {
        nickname,
        dupError,
        checking,
        profileImgUrl,
        agreements,
        canSubmit,

        setNickname,
        handleBlurNickname,
        handlePickImage,
        handleCheckAll,
        handleCheckItem,
        handleSubmit,
    } = useSocialSignupForm();

    return (
        <section className="pt-12 px-2 overflow-hidden overscroll-none">
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

            <AgreementsField
                value={agreements}
                onChangeAll={handleCheckAll}
                onChangeItem={handleCheckItem}
            />

            <OpuActionButton
                label="다음"
                disabled={!canSubmit}
                onClick={handleSubmit}
            />
        </section>
    );
}
