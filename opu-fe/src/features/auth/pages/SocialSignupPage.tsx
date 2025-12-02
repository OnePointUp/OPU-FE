"use client";

import NicknameField from "@/features/user/components/NicknameField";
import AgreementsField from "@/features/auth/components/AgreementsField";
import OpuActionButton from "@/components/common/OpuActionButton";
import { useSocialSignupForm } from "@/features/auth/hooks/useSocialSignup";

export default function SocialSignupPage() {
    const {
        nickname,
        dupError,
        checking,
        agreements,
        canSubmit,

        setNickname,
        handleBlurNickname,
        handleCheckAll,
        handleCheckItem,
        handleSubmit,
    } = useSocialSignupForm();

    return (
        <section className="overflow-hidden overscroll-none">
            <NicknameField
                value={nickname}
                onChange={(v) => {
                    setNickname(v);
                }}
                onBlurCheck={handleBlurNickname}
                error={dupError}
                checking={checking}
            />

            <AgreementsField
                value={agreements}
                onChangeAll={handleCheckAll}
                onChangeItem={handleCheckItem}
            />

            <OpuActionButton
                label="다음"
                disabled={!canSubmit}
                onClick={handleSubmit}
            />
        </section>
    );
}
