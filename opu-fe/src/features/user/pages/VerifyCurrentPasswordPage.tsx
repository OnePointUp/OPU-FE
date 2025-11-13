"use client";

import Header from "@/components/layout/Header";
import PasswordInput from "@/features/user/components/PasswordInput";
import BottomActionBar from "@/components/common/BottomActionBar";
import { useVerifyCurrentPassword } from "@/features/user/hooks/useVerifyCurrentPassword";

export default function VerifyCurrentPasswordPage() {
    const { cur, err, loading, canNext, handleChangeCurrent, handleNext } =
        useVerifyCurrentPassword();

    return (
        <div className="app-page">
            <Header title="비밀번호 변경" />
            <main className="app-container pt-app-header pb-40">
                <section
                    className="w-full px-2 pb-24"
                    style={{ width: "min(100%, var(--app-max))" }}
                >
                    <PasswordInput
                        label="현재 비밀번호"
                        value={cur}
                        onChange={handleChangeCurrent}
                        placeholder="********"
                        error={err}
                    />
                </section>
            </main>

            <BottomActionBar
                label="다음"
                disabled={!canNext}
                loading={loading}
                onClick={handleNext}
            />
        </div>
    );
}
