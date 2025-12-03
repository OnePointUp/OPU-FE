"use client";

import PasswordInput from "@/features/auth/components/PasswordInput";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useSearchParams } from "next/navigation";
import { useVerifyPasswordForWithdraw } from "../hooks/useVerifyPasswordForWithdraw";
import { useVerifyCurrentPassword } from "../hooks/useVerifyCurrentPassword";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function VerifyCurrentPasswordPage() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") ?? "change";
    const isWithdraw = mode === "withdraw";

    const changeHook = useVerifyCurrentPassword();
    const withdrawHook = useVerifyPasswordForWithdraw();

    const { cur, err, loading, canNext, handleChangeCurrent, handleNext } =
        isWithdraw ? withdrawHook : changeHook;

    const confirmModalProps = isWithdraw
        ? withdrawHook.confirmModalProps
        : undefined;

    return (
        <section>
            <PasswordInput
                label="현재 비밀번호"
                value={cur}
                onChange={handleChangeCurrent}
                placeholder="비밀번호를 입력해주세요."
                error={err}
            />

            <OpuActionButton
                label={isWithdraw ? "탈퇴하기" : "다음"}
                disabled={!canNext}
                loading={loading}
                onClick={handleNext}
            />

            {confirmModalProps && <ConfirmModal {...confirmModalProps} />}
        </section>
    );
}
