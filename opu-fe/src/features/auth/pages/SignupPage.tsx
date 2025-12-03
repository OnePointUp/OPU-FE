"use client";

import EmailField from "@/features/auth/components/EmailField";
import PasswordInput from "@/features/auth/components/PasswordInput";
import NicknameField from "@/features/member/components/NicknameField";
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

    const passwordRules = [
        { label: "영문포함", satisfied: /[a-zA-Z]/.test(password) },
        { label: "숫자포함", satisfied: /\d/.test(password) },
        { label: "특수문자포함", satisfied: /[!@#$%^&*]/.test(password) },
        {
            label: "8자이상",
            satisfied: password.length >= 8 && password.length <= 20,
        },
    ];

    const matchActive =
        confirmPassword.length > 0 && !isPwMismatch && password.length > 0;

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
                placeholder="비밀번호를 입력해주세요."
                rules={passwordRules}
            />

            <PasswordInput
                label="비밀번호 확인"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="비밀번호를 다시 입력해주세요."
                statusLabel="비밀번호 일치"
                statusActive={matchActive}
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
