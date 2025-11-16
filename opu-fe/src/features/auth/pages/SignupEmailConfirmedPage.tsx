"use client";

import { useRouter } from "next/navigation";
import BottomActionBar from "@/components/common/BottomActionBar";
import Image from "next/image";

export default function EmailVerifyPage() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/login");
  };

  return (
    <div className="app-page relative overflow-hidden overscroll-none">

      {/* 메인 콘텐츠 */}
      <main
        className="
          absolute left-0 right-0 
          top-[var(--app-header-height,56px)] 
          bottom-[var(--bottom-action-height,172px)] 
          flex flex-col items-center justify-center px-6
        "
      >

        {/* 마스코트 이미지 */}
        <section className="flex justify-center my-10">
          <Image
            src="/images/cabit_congratulation4.png"
            alt="OPU mascot"
            width={280}
            height={280}
            priority
          />
        </section>

        {/* 안내 문구 */}
        <div
          className="flex-col justify-center items-center"
        >
          <p
          className="leading-relaxed text-center"
          style={{
              color: "var(--color-dark-navy)",
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
      <BottomActionBar label="OPU 시작하기" disabled={false} onClick={handleNext} />
    </div>
  );
}
