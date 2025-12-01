"use client";

import OpuActionButton from "@/components/common/OpuActionButton";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailFailedPage() {
    const router = useRouter();
    const params = useSearchParams();

    const reason = params.get("reason");

    const isExpired = reason === "expired";
    const isInvalid = reason === "invalid";

    const handleNext = () => {
        router.push("/login");
    };

    return (
        <section className="pt-8 overflow-hidden overscroll-none">
            <main className="flex flex-col items-center gap-4">
                {/* 설명 */}
                <span
                    className="text-center mb-4"
                    style={{
                        font: "var(--text-sub)",
                        color: "var(--color-dark-gray)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    {isExpired
                        ? "이메일 인증 링크가 만료되었습니다."
                        : isInvalid
                        ? "회원가입에 실패하였습니다."
                        : "이메일 인증에 실패하였습니다."}
                </span>

                {/* 확인 버튼 */}
                <OpuActionButton
                    label="확인"
                    disabled={false}
                    onClick={handleNext}
                    positionFixed={false}
                    className="w-full"
                />
            </main>
        </section>
    );
}
