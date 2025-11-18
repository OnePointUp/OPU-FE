"use client";

import Header from "@/components/layout/Header";
import EmailField from "@/features/auth/components/EmailField";
import PasswordInput from "@/features/user/components/PasswordInput";
import NicknameField from "@/features/user/components/NicknameField";
import AgreementsField from "@/features/auth/components/AgreementsField";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useSignupEmail } from "@/features/auth/hooks/useEmailSignup";
import ProfileAvatarPicker from "@/features/user/components/ProfileAvatarPicker";

export default function RegisterEmailPage() {
  const {
    profileImgUrl,
    email,
    emailError,
    password,
    confirmPassword,
    nickname,
    dupError,
    checking,
    agreements,
    isPwMismatch,
    canSubmit,
    loading,

    setPassword,
    setConfirmPassword,
    setNickname,
    handlePickImage,
    handleEmailChange,
    handleBlurNickname,
    handleCheckAll,
    handleCheckItem,
    handleSubmit,
  } = useSignupEmail();

  return (
    <div className="app-page overflow-hidden overscroll-none">
      <Header title="회원가입" showBack />

      <main className="app-container pt-app-header pb-40 px-6">
        <ProfileAvatarPicker
                  nickname={nickname}
                  previewUrl={profileImgUrl}
                  onPick={handlePickImage}
                  className="mt-[35px]"
        />

        <EmailField value={email} onChange={handleEmailChange} error={emailError} />

        <PasswordInput
          label="비밀번호"
          value={password}
          onChange={setPassword}
        />

        <PasswordInput
          label="비밀번호 확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={isPwMismatch ? "일치하지 않는 비밀번호입니다." : undefined}
        />

        <NicknameField
          value={nickname}
          onChange={(v) => setNickname(v)}
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

      <OpuActionButton
        label="다음"
        disabled={!canSubmit}
        loading={loading}
        onClick={handleSubmit}
      />
    </div>
  );
}
