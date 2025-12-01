"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { AuthMember, useAuthStore } from "@/stores/useAuthStore";

type KakaoLoginResponse = {
    needAdditionalInfo: boolean;
    providerId?: string;
    token?: {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresInSeconds: number;
        refreshExpiresInSeconds: number;
    };
    member?: AuthMember;
};

export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            router.replace("/welcome");
            return;
        }

        const login = async () => {
            try {
                // 백엔드 카카오 로그인 엔드포인트 호출
                const res = await apiClient.get("/auth/kakao/login", {
                    params: { code },
                    skipAuth: true,
                });

                const body = res.data ?? {};
                const data: KakaoLoginResponse = body.data ?? body ?? {};

                const token = data.token ?? null;
                const member = data.member ?? null;

                // 토큰 저장
                if (token?.accessToken && token?.refreshToken && member) {
                    useAuthStore.getState().setAuth({
                        accessToken: token.accessToken,
                        refreshToken: token.refreshToken,
                        member,
                    });
                }

                if (data.needAdditionalInfo && data.providerId) {
                    router.replace(
                        `/social-signup?provider=kakao&providerId=${data.providerId}`
                    );
                } else {
                    router.replace("/");
                }
            } catch (e) {
                console.error("카카오 로그인 처리 실패:", e);
                router.replace("/welcome");
            }
        };

        void login();
    }, [router, searchParams]);

    return (
        <section className="flex min-h-[100svh] items-center justify-center">
            <p className="text-body text-[var(--color-dark-gray)]">
                카카오 로그인 처리 중이에요...
            </p>
        </section>
    );
}
