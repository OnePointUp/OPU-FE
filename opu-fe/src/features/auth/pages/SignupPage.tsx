"use client";

import EmailField from "@/features/auth/components/EmailField";
import PasswordInput from "@/features/auth/components/PasswordInput";
import NicknameField from "@/features/user/components/NicknameField";
import AgreementsField from "@/features/auth/components/AgreementsField";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useSignupEmail } from "@/features/auth/hooks/useEmailSignup";

export default function RegisterEmailPage() {
    const {
        email,
        emailError,
        password,
        confirmPassword,
        nickname,
        agreements,
        isPwMismatch,
        canSubmit,
        loading,

        setPassword,
        setConfirmPassword,
        setNickname,
        handleEmailChange,
        handleCheckAll,
        handleCheckItem,
        handleSubmit,
    } = useSignupEmail();

    return (
        <section>
            <EmailField
                value={email}
                onChange={handleEmailChange}
                error={emailError}
            />

            <PasswordInput
                label="비밀번호"
                value={password}
                onChange={setPassword}
            />

            <PasswordInput
                label="비밀번호 확인"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={
                    isPwMismatch ? "일치하지 않는 비밀번호입니다." : undefined
                }
            />

            <NicknameField value={nickname} onChange={(v) => setNickname(v)} />

            <AgreementsField
                value={agreements}
                onChangeAll={handleCheckAll}
                onChangeItem={handleCheckItem}
            />

            <OpuActionButton
                label="다음"
                disabled={!canSubmit}
                loading={loading}
                onClick={handleSubmit}
            />
        </section>
    );
}
