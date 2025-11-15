"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import EmailField from "@/features/auth/components/EmailField";
import PasswordInput from "@/features/user/components/PasswordInput";
import NicknameField from "@/features/user/components/NicknameField";
import AgreementsField from "@/features/auth/components/AgreementsField";
import BottomActionBar from "@/components/common/BottomActionBar";

import { checkNicknameDup } from "@/features/user/services";
import { validateEmail } from "@/features/auth/services";
import { requestSignupEmail } from "@/features/auth/services";
import { toastError, toastSuccess } from "@/lib/toast";

export default function RegisterEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [dupError, setDupError] = useState("");
  const [checking, setChecking] = useState(false);

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
    notification: false,
  });

  // 이메일 입력할 때 검사
  function handleEmailChange(v: string) {
    setEmail(v);
    setEmailError(validateEmail(v));
  }

  // 닉네임 blur 시 중복체크
  async function handleBlurNickname() {
    const v = nickname.trim();
    if (!v) {
      setDupError("닉네임을 입력해 주세요.");
      return;
    }

    setChecking(true);
    try {
      const isDup = await checkNicknameDup(v, undefined);
      setDupError(isDup ? "이미 존재하는 닉네임입니다." : "");
    } catch {
      setDupError("닉네임 검사 중 오류가 발생했습니다.");
    } finally {
      setChecking(false);
    }
  }

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
      await requestSignupEmail({
        email: email.trim(),
        password: password,
        nickname: nickname.trim(),
      });

      toastSuccess("인증용 이메일이 발송되었습니다.");
      router.push("/signup/check-email");
    } catch {
      toastError("인증 이메일 발송 중 문제가 발생했어요.");
    }
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

  return (
    <div className="app-page overflow-hidden overscroll-none">
      <Header title="회원가입" showBack />

      <main className="app-container pt-app-header pb-40 px-6">

        <EmailField value={email} onChange={handleEmailChange} error={emailError} />

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

      <BottomActionBar label="다음" disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}
