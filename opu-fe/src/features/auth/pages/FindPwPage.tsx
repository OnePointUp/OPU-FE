"use client";

import EmailField from "@/features/auth/components/EmailField";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useFindPassword } from "@/features/auth/hooks/useFindPassword";

export default function FindPasswordPage() {
    const {
        email,
        emailError,
        loading,
        canSubmit,
        handleEmailChange,
        handleSubmit,
    } = useFindPassword();

    return (
        <section className="pt-8 overflow-hidden overscroll-none">
            <main className="flex flex-col items-center">
                {/* 설명 */}
                <span
                    className="text-center mb-5"
                    style={{
                        font: "var(--text-sub)",
                        color: "var(--color-dark-gray)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    비밀번호 재설정을 위해
                    <br />
                    가입하신 이메일 주소를 입력해주세요.
                </span>

                {/* 입력 폼 */}
                <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <EmailField
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError}
                        isLabeled={false}
                    />

                    <OpuActionButton
                        label="확인"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        loading={loading}
                        positionFixed={false}
                    />
                </form>
            </main>
        </section>
    );
}
