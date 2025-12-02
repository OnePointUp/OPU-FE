"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, type AuthMember } from "@/stores/useAuthStore";
import { KakaoLoginResponse } from "../types";
import { requestKakaoLogin } from "../services";

function applyKakaoAuth(data: KakaoLoginResponse) {
    const token = data.token;
    if (!token?.accessToken || !token.refreshToken) {
        return;
    }

    const memberFromServer = data.member;
    const currentMember = useAuthStore.getState().member;

    let safeMember: AuthMember;

    if (memberFromServer) {
        safeMember = memberFromServer;
    } else if (currentMember) {
        safeMember = currentMember;
    } else {
        safeMember = {
            id: 0,
            email: "",
            nickname: "",
        };
    }

    useAuthStore.getState().setAuth({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        member: safeMember,
    });
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

                applyKakaoAuth(data);

                if (data.needAdditionalInfo && data.providerId) {
                    router.replace(
                        `/social-signup?provider=kakao&providerId=${data.providerId}`
                    );
                } else {
                    router.replace("/");
                }
            } catch (error) {
                console.error("카카오 로그인 처리 실패:", error);
                router.replace("/welcome");
            }
        };

        void run();
    }, [router, searchParams]);
}
