"use client";

import SearchBar from "@/components/common/SearchBar";
import ConfirmModal from "@/components/common/ConfirmModal";
import ActionList from "@/components/common/ActionList";
import BottomSheet from "@/components/common/BottomSheet";
import type { OpuCardModel } from "@/features/opu/domain";
import { useBlockedOpuList } from "@/features/blocked-opu/hooks/useBlockedOpuList";
import OpuRankingCard from "./OpuRankingCard";
import OpuRankingCardSkeleton from "./OpuRankingCardSkeleton";
import { Icon } from "@iconify/react";

type Props = {
    initialItems: OpuCardModel[];
    loading?: boolean;
    onDeleteSelected?: (ids: number[]) => Promise<void> | void;
    onUnblockOne?: (id: number) => Promise<void> | void;
};

export default function OpuRankingList({
    initialItems,
    loading = false,
    onDeleteSelected,
    onUnblockOne,
}: Props) {
    const {
        filtered,
        selected,
        sheetItemId,
        toggleOne,
        handleAddTodo,
        handleUnblockOne,
        openSheetFor,
        closeSheet,
    } = useBlockedOpuList({
        initialItems,
        onDeleteSelected,
        onUnblockOne,
    });

    const sheetOptions = (id: number) => [
        { label: "투두리스트에 추가", onClick: () => handleAddTodo(id) },
        {
            label: "차단 해제",
            danger: true,
            onClick: () => handleUnblockOne(id),
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6 mt-3" />

            {/* OPU 랭킹 */}
            <div className="flex flex-col pt-3">
                <p
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                    }}
                >
                    많이 수행한 OPU
                </p>
                <p
                    style={{
                        fontSize: "var(--text-mini)",
                        color: "var(--color-dark-gray)",
                    }}
                >
                    월별 완료 횟수 TOP 3
                </p>
            </div>

            {/* 리스트 */}
            <div className="flex flex-col gap-2.5">
                {loading ? (
                    Array.from({ length: filtered.length || 4 }).map(
                        (_, idx) => (
                            <OpuRankingCardSkeleton key={idx} selectable />
                        )
                    )
                ) : (
                    <>
                        {filtered.map((item) => (
                            <OpuRankingCard
                                key={item.id}
                                item={item}
                                selectable
                                checked={selected.has(item.id)}
                                onCheckedChange={toggleOne}
                                onMore={openSheetFor}
                            />
                        ))}

                        {filtered.length === 0 && (
                            <div
                                className="text-center py-5"
                                style={{
                                    fontSize: "var(--text-caption)",
                                    color: "var(--color-light-gray)",
                                }}
                            >
                                <p>아직 수행한 OPU가 없어요 😅 </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 바텀시트 + 액션리스트 */}
            <BottomSheet open={sheetItemId !== null} onClose={closeSheet}>
                {sheetItemId !== null && (
                    <ActionList items={sheetOptions(sheetItemId)} />
                )}
            </BottomSheet>
        </div>
    );
}
