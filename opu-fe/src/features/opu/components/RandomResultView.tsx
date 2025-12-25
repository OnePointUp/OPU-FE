"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import type { OpuCardModel } from "@/features/opu/domain";
import RandomOpuCard from "@/features/opu/components/RandomOpuCard";
import { addTodoByOpu } from "@/features/opu/service";
import { toastError, toastSuccess } from "@/lib/toast";
import { blockOpu } from "@/features/blocked-opu/services";
import OpuActionButton from "@/components/common/OpuActionButton";

type Props = {
    item: OpuCardModel;
    onRetry?: () => void;
};

export default function RandomResultView({ item, onRetry }: Props) {
    const router = useRouter();

    const handleConfirm = () => {
        router.push("/");
    };

    const handleBlock = async (opuId: number) => {
        try {
            await blockOpu(opuId);
            toastSuccess("OPU를 차단했어요.");
            onRetry?.();
        } catch (e) {
            console.error(e);
            toastError("OPU 차단을 실패했어요.");
        }
    };

    const handleAddTodo = async (opuId: number) => {
        try {
            await addTodoByOpu(opuId);
            toastSuccess("해당 OPU가 오늘 할 일에 추가됐어요.");
        } catch (e) {
            console.error(e);
            toastError("투두리스트에 추가하지 못했어요.");
        }
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
                        className="underline cursor-pointer"
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
                    onClick={onRetry}
                    className="w-full h-[56px] rounded-[18px] border flex items-center justify-center gap-2 bg-white cursor-pointer"
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
