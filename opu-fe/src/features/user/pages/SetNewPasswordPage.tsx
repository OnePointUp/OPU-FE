"use client";

import PasswordInput from "@/features/user/components/PasswordInput";
import OpuActionButton from "@/components/common/OpuActionButton";
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
        <section>
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
