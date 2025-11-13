"use client";

import Header from "@/components/layout/Header";
import PasswordInput from "@/features/user/components/PasswordInput";
import BottomActionBar from "@/components/common/BottomActionBar";
import { useSetNewPassword } from "@/features/user/hooks/useSetNewPassword";

export default function PasswordChange2Page() {
    const {
        next,
        confirm,
        errNext,
        errConfirm,
        loading,
        canSubmit,
        handleChangeNext,
        handleChangeConfirm,
        handleSubmit,
    } = useSetNewPassword();

    return (
        <div className="app-page">
            <Header title="비밀번호 변경" />
            <main className="app-container pt-app-header pb-40">
                <section
                    className="w-full px-2 pb-24"
                    style={{ width: "min(100%, var(--app-max))" }}
                >
                    <PasswordInput
                        label="새 비밀번호"
                        value={next}
                        onChange={handleChangeNext}
                        placeholder="@LwEoLgXgU7"
                        error={errNext}
                    />
                    <PasswordInput
                        label="비밀번호 확인"
                        value={confirm}
                        onChange={handleChangeConfirm}
                        placeholder="@LwEoLgXgU7"
                        error={errConfirm}
                    />
                </section>
            </main>

            <BottomActionBar
                label="저장"
                disabled={!canSubmit}
                loading={loading}
                onClick={handleSubmit}
                className="px-2"
            />
        </div>
    );
}
