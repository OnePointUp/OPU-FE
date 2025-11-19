"use client";

import Image from "next/image";
import EmailField from "@/features/auth/components/EmailField";
import PasswordInput from "@/features/user/components/PasswordInput";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginPage() {
    const router = useRouter();
    const {
        email,
        emailError,
        password,
        loading,
        canSubmit,

        setPassword,
        handleEmailChange,
        handleSubmit,
    } = useLogin();

    return (
        <div className="app-page overflow-hidden overscroll-none">
            <main className="app-container pt-app-header pb-40 px-6 flex flex-col items-center">
                {/* 로고 */}
                <div className="mt-14 flex justify-center">
                    <Image
                        src="/images/cabit_logo3.png"
                        alt="OPU mascot"
                        width={160}
                        height={160}
                        priority
                    />
                </div>

                {/* 입력 폼 */}
                <form
                    className="w-full flex flex-col"
                    onSubmit={(e) => e.preventDefault()}
                >
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

                    <OpuActionButton
                        label="로그인"
                        disabled={!canSubmit}
                        loading={loading}
                        onClick={handleSubmit}
                        positionFixed={false}
                        className="mt-6"
                    />
                </form>

                {/* 하단 링크 */}
                <div className="text-center text-[length:var(--text-caption)] text-[color:var(--color-light-gray)] mt-[15px]">
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => router.push("/welcome")}
                    >
                        회원가입
                    </span>
                    {"  |  "}
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => router.push("/find-pw")}
                    >
                        비밀번호 찾기
                    </span>
                </div>
            </main>
        </div>
    );
}
