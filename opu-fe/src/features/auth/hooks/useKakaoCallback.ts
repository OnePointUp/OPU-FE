"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, type AuthMember } from "@/stores/useAuthStore";
import { KakaoLoginResponse } from "../types";
import { requestKakaoLogin } from "../services";
import { toastError } from "@/lib/toast";
import { fetchWebPushStatus } from "@/features/notification/services";

const PUSH_KEY = "opu_push_prompt_v1";

function applyKakaoAuth(data: KakaoLoginResponse) {
    const token = data.token;

    if (!token?.accessToken || !token.refreshToken) return;

    const memberFromServer = data.member;
    const currentMember = useAuthStore.getState().member;

    let safeMember: AuthMember;

    if (memberFromServer) {
        safeMember = memberFromServer;
    } else if (currentMember) {
        safeMember = currentMember;
    } else {
        safeMember = { id: 0, email: "", nickname: "" };
    }

    useAuthStore.getState().setAuth({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        member: safeMember,
    });
}

async function syncPushPromptKey() {
    try {
        const status = await fetchWebPushStatus();

        if (status.webPushAgreed) {
            localStorage.setItem(PUSH_KEY, "1");
        } else {
            localStorage.removeItem(PUSH_KEY);
        }
    } catch {
        localStorage.setItem(PUSH_KEY, "1");
    }
}

export function useKakaoCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            router.replace("/welcome");
            return;
        }

        const run = async () => {
            try {
                const data = await requestKakaoLogin(code);

                // 1) 토큰/멤버 세팅
                applyKakaoAuth(data);

                // 2) 서버 동의 상태로 KEY 동기화 (조건부)
                await syncPushPromptKey();

                // 3) 라우팅
                if (data.needAdditionalInfo && data.providerId) {
                    router.replace(
                        `/social-signup?provider=kakao&providerId=${data.providerId}`
                    );
                } else {
                    router.replace("/");
                }
            } catch (error) {
                console.error("카카오 로그인 처리 실패:", error);
                toastError("로그인 처리 중 오류가 발생했습니다.");
                router.replace("/welcome");
            }
        };

        void run();
    }, [router, searchParams]);
}
