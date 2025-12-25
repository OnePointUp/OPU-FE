"use client";

import SearchBar from "@/components/common/SearchBar";
import ConfirmModal from "@/components/common/ConfirmModal";
import ActionList from "@/components/common/ActionList";
import BottomSheet from "@/components/common/BottomSheet";
import BlockedOpuCard from "./BlockedOpuCard";
import type { OpuCardModel } from "@/features/opu/domain";
import { useBlockedOpuList } from "@/features/blocked-opu/hooks/useBlockedOpuList";
import BlockedOpuCardSkeleton from "./BlockedOpuCardSkeleton";

type Props = {
    initialItems: OpuCardModel[];
    loading?: boolean;
    onDeleteSelected?: (ids: number[]) => Promise<void> | void;
    onUnblockOne?: (id: number) => Promise<void> | void;
};

export default function BlockedOpuList({
    initialItems,
    loading = false,
    onDeleteSelected,
    onUnblockOne,
}: Props) {
    const {
        filtered,
        selected,
        qInput,
        allSelected,
        allIds,
        showConfirm,
        sheetItemId,
        setQInput,
        setShowConfirm,
        toggleOne,
        toggleAllOnPage,
        handleDeleteSelected,
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
            {/* 검색 + 선택바 */}
            <div className="flex flex-col gap-3">
                <SearchBar
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    onSubmit={(v) => setQInput(v)}
                    placeholder="차단 OPU 검색"
                    className="mb-6"
                />

                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm mx-1">
                        <input
                            type="checkbox"
                            className="custom-checkbox shrink-0"
                            checked={allSelected}
                            onChange={(e) => toggleAllOnPage(e.target.checked)}
                        />
                        <span
                            className="flex gap-1 items-center"
                            style={{ fontSize: "var(--text-sub)" }}
                        >
                            <p>{allSelected ? "전체해제" : "전체선택"}</p>
                            <p
                                style={{
                                    color: "var(--color-dark-gray)",
                                }}
                            >
                                ({selected.size}/{allIds.length})
                            </p>
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="h-7 px-2 rounded-md bg-[var(--color-opu-dark-green)] text-[12px] font-[var(--weight-medium)] text-white disabled:opacity-50 cursor-pointer"
                        disabled={selected.size === 0}
                        title="선택 삭제"
                    >
                        선택삭제 ({selected.size})
                    </button>

                    <ConfirmModal
                        isOpen={showConfirm}
                        message={`선택한 ${selected.size}개의 OPU 차단을\n해제하시겠습니까?`}
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={handleDeleteSelected}
                    />
                </div>
            </div>

            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6" />

            {/* 리스트 */}
            <div className="flex flex-col gap-2.5">
                {loading ? (
                    Array.from({ length: filtered.length || 4 }).map(
                        (_, idx) => (
                            <BlockedOpuCardSkeleton key={idx} selectable />
                        )
                    )
                ) : (
                    <>
                        {filtered.map((item) => (
                            <BlockedOpuCard
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
                                className="text-center text-sm py-10"
                                style={{
                                    fontSize: "var(--text-sub)",
                                    color: "var(--color-light-gray)",
                                }}
                            >
                                차단한 OPU가 없습니다.
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
