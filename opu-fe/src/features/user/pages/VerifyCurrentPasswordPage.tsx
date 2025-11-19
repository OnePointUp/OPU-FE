"use client";

import PasswordInput from "@/features/user/components/PasswordInput";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useVerifyCurrentPassword } from "@/features/user/hooks/useVerifyCurrentPassword";

export default function VerifyCurrentPasswordPage() {
    const { cur, err, loading, canNext, handleChangeCurrent, handleNext } =
        useVerifyCurrentPassword();

    return (
        <div className="app-container pt-app-header pb-40 px-6">
            <PasswordInput
                label="현재 비밀번호"
                value={cur}
                onChange={handleChangeCurrent}
                placeholder="비밀번호를 입력해주세요."
                error={err}
            />

            <OpuActionButton
                label="다음"
                disabled={!canNext}
                loading={loading}
                onClick={handleNext}
            />
        </div>
    );
}
