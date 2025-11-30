"use client";

import PasswordInput from "@/features/auth/components/PasswordInput";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useSetNewPassword } from "@/features/auth/hooks/useSetNewPassword";

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
        <section>
            <div className="flex flex-col">
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
            </div>

            <OpuActionButton
                label="저장"
                disabled={!canSubmit}
                loading={loading}
                onClick={handleSubmit}
                className="px-2"
            />
        </section>
    );
}
