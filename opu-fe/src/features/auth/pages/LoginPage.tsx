"use client";

import Image from "next/image";
import EmailField from "@/features/auth/components/EmailField";
import PasswordInput from "@/features/auth/components/PasswordInput";
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
        <section className="py-3">
            <div className="flex flex-col items-center px-2">
                {/* 로고 */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/images/cabit_logo3.png"
                        alt="OPU mascot"
                        width={130}
                        height={130}
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
                        placeholder="이메일"
                    />

                    <PasswordInput
                        label="비밀번호"
                        value={password}
                        onChange={setPassword}
                        placeholder="비밀번호"
                    />
                </form>
            </div>

            <OpuActionButton
                label="로그인"
                disabled={!canSubmit}
                loading={loading}
                onClick={handleSubmit}
                positionFixed={false}
            />

            {/* 하단 링크 */}
            <div className="text-center text-[length:var(--text-caption)] text-[color:var(--color-light-gray)] mt-[15px]">
                <span
                    className="cursor-pointer hover:underline"
                    onClick={() => router.push("/signup")}
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
        </section>
    );
}
