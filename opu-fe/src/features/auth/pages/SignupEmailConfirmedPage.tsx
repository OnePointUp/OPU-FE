"use client";

import { useRouter } from "next/navigation";
import OpuActionButton from "@/components/common/OpuActionButton";
import Image from "next/image";

export default function EmailVerifyPage() {
    const router = useRouter();

    const handleNext = () => {
        router.push("/login");
    };

    return (
        <section className="overflow-hidden overscroll-none pt-8">
            {/* 메인 콘텐츠 */}
            <main className="flex flex-col items-center justify-center">
                {/* 마스코트 이미지 */}
                <Image
                    src="/images/cabit_congratulation4.png"
                    alt="OPU mascot"
                    width={260}
                    height={260}
                    priority
                />

                {/* 안내 문구 */}
                <div className="flex-col justify-center items-center">
                    <p
                        className="leading-relaxed text-center"
                        style={{
                            color: "var(--color-super-dark-gray)",
                            fontSize: "var(--text-h1)",
                            fontWeight: "var(--weight-bold)",
                        }}
                    >
                        회원가입 완료!
                    </p>

                    <p
                        className="leading-relaxed text-center"
                        style={{
                            color: "var(--color-dark-gray)",
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-semibold)",
                        }}
                    >
                        OPU 가입이 완료되었습니다.
                    </p>
                </div>
            </main>

            {/* 하단 버튼 */}
            <OpuActionButton
                label="OPU 시작하기"
                disabled={false}
                onClick={handleNext}
            />
        </section>
    );
}
