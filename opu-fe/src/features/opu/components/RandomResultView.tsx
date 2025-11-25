"use client";

import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OpuCardModel } from "@/features/opu/domain";
import RandomOpuCard from "@/features/opu/components/RandomOpuCard";
import { toastWarn } from "@/lib/toast";
import OpuActionButton from "@/components/common/OpuActionButton";

type Props = {
    item: OpuCardModel;
};

export default function RandomResultView({ item }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const scope = searchParams.get("scope") ?? "ALL";
    const time = searchParams.get("time") ?? "ALL";

    const handleRetry = () => {
        router.replace(
            `/opu/random/result?scope=${scope}&time=${time}&r=${Date.now()}`
        );
    };

    const handleConfirm = () => {
        // TODO: 나중에 캘린더로 바꿀 예정
        router.push("/opu");
    };

    const handleBlock = (opuId: number) => {
        console.log("차단 완료", opuId);
        toastWarn("차단하기 기능은 아직 연결 전입니다.");
    };

    const handleAddTodo = (opuId: number) => {
        // TODO: 실제 투두 추가 로직
        console.log("투두 추가", opuId);
        toastWarn("투두 추가 기능은 아직 연결 전입니다.");
    };

    return (
        <div className="relative bg-[var(--background)]">
            <section className="px-3 pt-5">
                <p
                    className="text-center mb-5"
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-regular)",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    당신의 하루 목표에 넣어보세요 ✨
                </p>

                <RandomOpuCard item={item} onAddTodo={handleAddTodo} />

                <div className="text-center mt-4">
                    <p
                        style={{
                            fontSize: "var(--text-mini)",
                            color: "var(--color-dark-gray)",
                            fontWeight: "var(--weight-regular)",
                        }}
                    >
                        앞으로 이 OPU를 보고 싶지 않다면?
                    </p>
                    <button
                        type="button"
                        onClick={() => handleBlock(item.id)}
                        className="underline"
                        style={{
                            fontSize: "var(--text-mini)",
                            fontWeight: "var(--weight-medium)",
                            color: "var(--color-light-gray)",
                        }}
                    >
                        차단하기
                    </button>
                </div>
            </section>

            {/* 버튼 영역 */}
            <div
                className="fixed left-0 right-0 bottom-0 px-5 pt-3 pb-[max(16px,var(--safe-bottom))] bg-[var(--background)] flex flex-col gap-2"
                style={{
                    width: "min(100%, var(--app-max))",
                    margin: "0 auto",
                }}
            >
                {/* 다시 뽑기 */}
                <button
                    type="button"
                    onClick={handleRetry}
                    className="w-full h-[56px] rounded-[18px] border flex items-center justify-center gap-2 bg-white"
                    style={{
                        borderColor: "var(--color-light-gray)",
                        color: "var(--color-light-gray)",
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-medium)",
                    }}
                >
                    <Icon
                        icon="material-symbols:refresh-rounded"
                        width={18}
                        height={18}
                    />
                    <span>다시 뽑기</span>
                </button>

                <OpuActionButton
                    label="확인"
                    disabled={false}
                    loading={false}
                    onClick={handleConfirm}
                    positionFixed={false}
                    className="w-full px-0 pt-0 pb-0"
                />
            </div>
        </div>
    );
}
