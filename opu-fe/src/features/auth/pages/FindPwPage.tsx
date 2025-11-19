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
        <div className="app-page overflow-hidden overscroll-none">
            <main className="app-container pt-app-header pb-40 px-6 flex flex-col items-center">
                {/* 설명 */}
                <div className="mt-[62px]">
                    <p
                        className="text-center"
                        style={{
                            font: "var(--text-sub)",
                            color: "var(--color-dark-gray)",
                            fontWeight: "var(--weight-semibold)",
                        }}
                    >
                        비밀번호 재설정을 위해
                        <br />
                        가입하신 이메일 주소를 입력해주세요.
                    </p>
                </div>

                {/* 입력 폼 */}
                <form
                    className="w-full flex flex-col gap-[17px]"
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
        </div>
    );
}
