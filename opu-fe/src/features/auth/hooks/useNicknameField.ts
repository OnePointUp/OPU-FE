"use client";

import { useState, useCallback } from "react";
import { checkNicknameDup } from "@/utils/validation";

type UseNicknameFieldOptions = {
    initialNickname?: string;
    currentNicknameForDupCheck?: string;
};

export function useNicknameField(options?: UseNicknameFieldOptions) {
    const [nickname, setNickname] = useState(options?.initialNickname ?? "");
    const [dupError, setDupError] = useState("");
    const [checking, setChecking] = useState(false);

    const handleBlurNickname = useCallback(async () => {
        const v = nickname.trim();
        if (!v) {
            setDupError("닉네임을 입력해 주세요.");
            return;
        }

        setChecking(true);
        try {
            const isDup = await checkNicknameDup(
                v,
                options?.currentNicknameForDupCheck
            );
            setDupError(isDup ? "이미 존재하는 닉네임입니다." : "");
        } catch {
            setDupError("닉네임 검사 중 오류가 발생했습니다.");
        } finally {
            setChecking(false);
        }
    }, [nickname, options?.currentNicknameForDupCheck]);

    return {
        nickname,
        setNickname,
        dupError,
        checking,
        handleBlurNickname,
        resetDupError: () => setDupError(""),
    };
}
