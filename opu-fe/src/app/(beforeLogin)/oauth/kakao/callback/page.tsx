"use client";

import { Suspense } from "react";
import KakaoLoginLoading from "@/features/auth/components/KakaoLoginLoading";
import { useKakaoCallback } from "@/features/auth/hooks/useKakaoCallback";

function KakaoCallbackBody() {
    useKakaoCallback();
    return <KakaoLoginLoading />;
}

export default function KakaoCallbackPage() {
    return (
        <Suspense fallback={null}>
            <KakaoCallbackBody />
        </Suspense>
    );
}
