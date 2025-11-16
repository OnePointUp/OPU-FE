"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OpuActionButton from "@/components/common/OpuActionButton"
import { validateEmail } from "../services";
import { toastError, toastSuccess } from "@/lib/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  // 이메일 재전송 처리
  const handleResendEmail = async () => {
    try {
      setIsSending(true);
      await new Promise((r) => setTimeout(r, 1000)); // TODO: 실제 API 연결
      toastSuccess("이메일이 재전송 되었습니다.");
    } catch (e) {
      toastError("이메일 재전송 중에 문제가 생겼습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  async function handleSubmit() {
    try {
          
          toastSuccess("비밀번호가 재설정 되었습니다.");
          router.push("/login");
        } catch (e) {
          toastError("이메일 재전송 중 문제가 생겼습니다. 다시 시도해주세요.");
        }
  }

  // 입력할 때마다 자동 검사
  function handleEmailChange(v: string) {
    setEmail(v);
    setEmailError(validateEmail(v));
  }

  return (
    <div className="app-page overflow-hidden overscroll-none">
      <Header title="비밀번호 찾기" showBack />

       <main className="app-container pt-app-header pb-40 px-6 flex flex-col items-center gap-[22px]">
        {/* 설명 */}
        <div className="mt-[62px]">
          <p
            style={{
              font: "var(--text-sub)",
              color: "var(--color-dark-gray)",
              fontWeight: "var(--weight-semibold)"
            }}
            className="text-center">
              비밀번호 재설정 링크가
              <br />
              가입하신 이메일로 발송되었습니다.
          </p>
        </div>

        {/* 확인 버튼 */}
        <OpuActionButton label="확인" onClick={handleSubmit} positionFixed={false} className="w-full" />

        {/* 하단 링크 */}
        <div className="text-center mb-8">
          <button
            onClick={handleResendEmail}
            disabled={isSending}
            style={{
                color: "var(--color-light-gray)",
                fontSize: "var(--text-caption)",
            }}
            className="underline disabled:opacity-50"
          >
            이메일을 받지 못하셨나요?
          </button>
        </div>
      </main>
    </div>
  );
}
