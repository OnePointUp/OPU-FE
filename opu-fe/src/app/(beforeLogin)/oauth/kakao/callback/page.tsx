"use client";

import KakaoLoginLoading from "@/features/auth/components/KakaoLoginLoading";
import { useKakaoCallback } from "@/features/auth/hooks/useKakaoCallback";

export default function KakaoCallbackPage() {
    useKakaoCallback();

    return <KakaoLoginLoading />;
}
