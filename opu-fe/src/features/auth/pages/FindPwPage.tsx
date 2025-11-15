"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EmailField from "../components/EmailField";
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
    !emailError;

  async function handleSubmit() {
    try {
          
          toastSuccess("이메일을 전송하였습니다.");
          router.push("/");
        } catch (e) {
          toastError("이메일 전송 중 문제가 생겼습니다. 이메일 주소를 확인하거나 다시 시도해주세요.");
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

       <main className="app-container pt-app-header pb-40 px-6 flex flex-col items-center">
        {/* 설명 */}
        <div className="mt-[62px]">
          <p
            style={{
              font: "var(--text-sub)",
              color: "var(--color-dark-gray)",
              fontWeight: "var(--weight-semibold)"
            }}
            className="text-center">
              비밀번호 재설정을 위해
              <br />
              가입하신 이메일 주소를 입력해주세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[17px]">
          <EmailField
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError}
                    isLabeled={false}
                  />

          {/* 확인 버튼 */}
          <MainButton label="확인" onClick={handleSubmit} fullWidth={true} disabled={!isActive}/>
        </form>
      </main>
    </div>
  );
}
