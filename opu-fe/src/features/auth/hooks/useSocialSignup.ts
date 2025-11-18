"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { checkNicknameDup } from "@/features/user/services";
import { toastSuccess, toastError } from "@/lib/toast";

export function useSocialSignupForm() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [dupError, setDupError] = useState("");
  const [checking, setChecking] = useState(false);

  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
    notification: false,
  });

  // 닉네임 중복 체크
  const handleBlurNickname = useCallback(async () => {
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
  }, [nickname]);

  // 프로필 이미지 선택
  const handlePickImage = useCallback((f: File) => {
    setFile(f);
    setProfileImgUrl(URL.createObjectURL(f));
  }, []);

  // 약관 전체 체크
  const handleCheckAll = useCallback((checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked,
      notification: checked,
    });
  }, []);

  // 약관 항목 체크
  const handleCheckItem = useCallback(
    (key: keyof typeof agreements, checked: boolean) => {
      const next = { ...agreements, [key]: checked };
      next.all =
        next.terms && next.privacy && next.marketing && next.notification;
      setAgreements(next);
    },
    [agreements]
  );

  // 제출 가능 조건
  const canSubmit =
    nickname.trim().length > 0 &&
    !dupError &&
    !checking &&
    agreements.terms &&
    agreements.privacy;

  // 제출
  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    try {
      await new Promise((r) => setTimeout(r, 500));

      toastSuccess("회원가입이 완료되었습니다.");
      router.push("/signup/check-email");
    } catch {
      toastError("회원가입 중 오류가 발생했습니다.");
    }
  }, [canSubmit, nickname, file, router]);

  return {
    nickname,
    dupError,
    checking,
    profileImgUrl,
    file,
    agreements,
    canSubmit,

    setNickname,
    handleBlurNickname,
    handlePickImage,
    handleCheckAll,
    handleCheckItem,
    handleSubmit,
  };
}
