"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import ProfileAvatarPicker from "@/features/user/components/ProfileAvatarPicker";
import NicknameField from "@/features/user/components/NicknameField";
import PasswordInput from "@/features/user/components/PasswordInput";
import EmailField from "@/features/user/components/EmailField";
import AgreementsField from "@/features/user/components/AgreementsField";
import BottomActionBar from "@/components/common/BottomActionBar";
import { checkNicknameDup, saveProfile } from "@/features/user/services";
import { toastError, toastSuccess } from "@/lib/toast";

export default function RegisterEmailPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [dupError, setDupError] = useState("");
  const [checking, setChecking] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
    notification: false,
  });

  const [profile] = useState<{ nickname: string | null }>({ nickname: null });

  // 이메일 형식 검사
  function validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) return "";
    if (!emailRegex.test(value)) return "이메일 형식에 맞게 입력해주세요.";
    return "";
  }

  // 입력할 때마다 자동 검사
  function handleEmailChange(v: string) {
    setEmail(v);
    const msg = validateEmail(v);
    setEmailError(msg);
  }

  async function handleBlurNickname() {
    if (!profile) return;
    const v = nickname.trim();
    if (!v) {
      setDupError("닉네임을 입력해 주세요.");
      return;
    }

    setChecking(true);
    try {
      const current = profile?.nickname ?? undefined;
      const isDup = await checkNicknameDup(v, current);
      setDupError(isDup ? "이미 존재하는 닉네임입니다." : "");
    } catch (err) {
      console.error("닉네임 중복 검사 실패:", err);
      setDupError("닉네임 검사 중 오류가 발생했습니다.");
    } finally {
      setChecking(false);
    }
  }

  function handlePickImage(f: File) {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  const handleCheckAll = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
      notification: checked,
    });
  };

  const handleCheckItem = (key: keyof typeof agreements, checked: boolean) => {
    const next = { ...agreements, [key]: checked };
    next.all = next.terms && next.privacy && next.marketing && next.notification;
    setAgreements(next);
  };

  const isPwMismatch = confirmPassword && confirmPassword !== password;

  const canSubmit =
    email.trim() &&
    !emailError && 
    password.trim() &&
    nickname.trim() &&
    !dupError &&
    !checking &&
    !isPwMismatch &&
    agreements.terms &&
    agreements.privacy;

  async function handleSubmit() {
    if (!canSubmit) return;

    try {
      await saveProfile({
        nickname: nickname.trim(),
        bio: "",
        profileFile: file,
      });
      toastSuccess("회원가입이 완료되었습니다!");
      history.back();
    } catch (e) {
      toastError("회원가입 실패");
    }
  }

  return (
    <div className="app-page overflow-hidden overscroll-none">
      <Header title="회원가입" showBack />

      <main className="app-container pt-app-header pb-40 px-6">
        <ProfileAvatarPicker
          nickname={nickname}
          previewUrl={previewUrl}
          onPick={handlePickImage}
        />
        <EmailField
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />

        <PasswordInput
          label="비밀번호"
          value={password}
          onChange={setPassword}
          placeholder="비밀번호를 입력하세요"
        />

        <PasswordInput
          label="비밀번호 확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="비밀번호를 다시 입력하세요"
          error={isPwMismatch ? "일치하지 않는 비밀번호입니다." : undefined}
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

        <AgreementsField
          value={agreements}
          onChangeAll={handleCheckAll}
          onChangeItem={handleCheckItem}
        />
      </main>

      <BottomActionBar
        label="다음"
        disabled={!canSubmit}
        onClick={handleSubmit}
      />
    </div>
  );
}
