// src/app/not-found.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import OpuActionButton from "@/components/common/OpuActionButton";

const TIPS = [
  "오늘 일정이 궁금하다면 캘린더를 열어보세요 👀",
  "매일 반복되는 일은 루틴으로 정리해두면 좋아요! ✨️",
  "새로움이 필요하다면 랜덤뽑기가 도와줄지도 몰라요 🎲",
];

export default function NotFound() {
  const router = useRouter();
  const [tip, setTip] = useState<string>("");

  // 클라이언트 마운트 이후에만 랜덤 Tip 선택
  useEffect(() => {
    const index = Math.floor(Math.random() * TIPS.length);
    setTip(TIPS[index]);
  }, []);

  // 뒤로가기 + fallback
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/"); // 필요 시 /calendar
    }
  };

  return (
    <div className="app-page app-shell">
      {/* 중앙 콘텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* 이미지 */}
        <Image
          src="/images/not-found.png"
          alt="페이지를 찾지 못한 OPU"
          width={250}
          height={250}
          priority
          className="mb-4"
        />

        {/* 타이틀 */}
        <div
          style={{ fontSize: "var(--text-h2)" }}
          className="font-semibold text-[var(--color-dark-navy)]"
        >
          페이지를 찾을 수 없어요
        </div>

        {/* 설명 */}
        <p
          style={{ fontSize: "var(--text-sub)" }}
          className="mt-2 leading-relaxed text-[var(--color-dark-gray)]"
        >
          OPU가 할 일을 찾고 있었지만
          <br />
          이 페이지는 보이지 않아요.
        </p>

        {/* 서브 카드 (랜덤 Tip) */}
        <div
          style={{ fontSize: "var(--text-sub)" }}
          className={clsx(
            "mt-6",
            "w-full",
            "rounded-2xl",
            "bg-[var(--color-super-light-pink)]",
            "px-5 py-6",
            "text-caption text-[var(--color-opu-dark-pink)]"
          )}
        >
          <span className="font-medium">💡 Tip</span>
          <br />
          {tip || "잠시만요, 팁을 준비하고 있어요 😊"}
        </div>
      </div>

      {/* 하단 버튼 */}
      <OpuActionButton
        label="이전으로 돌아가기"
        onClick={handleBack}
      />
    </div>
  );
}
