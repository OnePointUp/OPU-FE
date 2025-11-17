"use client";

import Header from "@/components/layout/Header";
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
    <div className="app-page overflow-hidden overscroll-none">
      <Header title="회원가입" showBack />

      <main className="app-container pt-app-header pb-40 px-6">
        <ProfileAvatarPicker
          nickname={nickname}
          previewUrl={profileImgUrl}
          onPick={handlePickImage}
          className="mt-[50px]"
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
      </main>

      <OpuActionButton label="다음" disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}
