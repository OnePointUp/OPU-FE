"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomActionBar from "@/components/common/BottomActionBar";
import Image from "next/image";
import { toastError, toastSuccess } from "@/lib/toast";

export default function EmailVerifyPage() {
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

  const handleNext = () => {
    router.push("/signup/email-confirmed");
  };

  return (
    <div className="app-page relative overflow-hidden overscroll-none">
      <Header title="회원가입" showBack />

      {/* 메인 콘텐츠 */}
      <main
        className="
          absolute left-0 right-0 
          top-[var(--app-header-height,56px)] 
          bottom-[var(--bottom-action-height,72px)] 
          flex flex-col items-center justify-center px-6
        "
      >
        {/* 안내 문구 */}
        <p
          className="leading-relaxed text-center"
          style={{
            color: "var(--color-dark-navy)",
            fontSize: "var(--text-sub)",
            fontWeight: "var(--weight-regular)",
          }}
        >
          이메일 인증을 위한 메일이 발송되었습니다.
          <br />
          회원가입 완료를 위한 이메일 인증을 진행해 주세요.
        </p>

        {/* 마스코트 이미지 */}
        <section className="flex justify-center my-10">
          <Image
            src="/images/cabit_letter2.png"
            alt="OPU mascot"
            width={230}
            height={230}
            priority
          />
        </section>

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

      {/* 하단 버튼 */}
      <BottomActionBar label="다음" disabled={false} onClick={handleNext} />
    </div>
  );
}
