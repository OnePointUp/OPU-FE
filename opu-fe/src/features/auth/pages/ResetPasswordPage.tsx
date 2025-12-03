"use client";

import PasswordInput from "@/features/auth/components/PasswordInput";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useSetNewPassword } from "@/features/auth/hooks/useSetNewPassword";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
    const params = useSearchParams();
    const token = params.get("token");

    const {
        next,
        confirm,
        errConfirm,
        loading,
        canSubmit,
        handleChangeNext,
        handleChangeConfirm,
        handleSubmit,
    } = useSetNewPassword(
        token ? { mode: "reset", resetToken: token } : { mode: "change" }
    );

    const rules = [
        { label: "영문포함", satisfied: /[a-zA-Z]/.test(next) },
        { label: "숫자포함", satisfied: /\d/.test(next) },
        { label: "특수문자포함", satisfied: /[!@#$%^&*]/.test(next) },
        {
            label: "8자이상",
            satisfied: next.length >= 8 && next.length <= 20,
        },
    ];

    const matchActive = confirm.length > 0 && next === confirm;

    return (
        <section>
            <div className="flex flex-col">
                <PasswordInput
                    label="새 비밀번호"
                    value={next}
                    onChange={handleChangeNext}
                    placeholder="비밀번호를 입력해주세요."
                    rules={rules}
                />
                <PasswordInput
                    label="비밀번호 확인"
                    value={confirm}
                    onChange={handleChangeConfirm}
                    placeholder="비밀번호를 다시 입력해주세요."
                    statusLabel="비밀번호 일치"
                    statusActive={matchActive}
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
