"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EmailField from "../components/EmailField";
import PasswordInput from "@/features/user/components/PasswordInput";
import MainButton from "@/components/common/MainButton"
import { validateEmail } from "../services";
import { toastError, toastSuccess } from "@/lib/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isActive =
    email.trim() &&
    password.trim() &&
    !emailError;

  async function handleSubmit() {
    try {
          
          toastSuccess("로그인 완료!");
          router.push("/");
        } catch (e) {
          toastError("이메일 또는 비밀번호를 다시 한 번 확인해주세요.");
        }
  }

  // 입력할 때마다 자동 검사
  function handleEmailChange(v: string) {
    setEmail(v);
    setEmailError(validateEmail(v));
  }

  return (
    <div className="app-page overflow-hidden overscroll-none">
      <Header title="로그인" showBack />

       <main className="app-container pt-app-header pb-40 px-6 flex flex-col items-center">
        {/* 로고 영역 */}
        <div className="mt-10 mb-10 flex justify-center">
          <Image
                      src="/images/cabit_logo.png"
                      alt="OPU mascot"
                      width={180}
                      height={180}
                      priority
                    />
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[17px]">
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

          {/* 로그인 버튼 */}
          <MainButton label="로그인" onClick={handleSubmit} fullWidth={true} disabled={!isActive}/>
        </form>

        {/* 하단 링크 */}
        <div
          className="flex justify-center gap-4 mt-4 text-xs"
          style={{color: "var(--color-light-gray)"}}
        >
          <button onClick={() => router.push("/welcome")}>회원가입</button>
          <span>|</span>
          <button onClick={() => router.push("/find-pw")}>비밀번호 찾기</button>
        </div>
      </main>
    </div>
  );
}
