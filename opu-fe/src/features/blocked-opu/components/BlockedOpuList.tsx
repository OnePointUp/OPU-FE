"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import type { OpuCardModel } from "@/types/opu";
import BlockedOpuCard from "./BlockedOpuCard";
import ConfirmModal from "@/components/common/ConfirmModal";
import ActionList from "@/components/common/ActionList";
import BottomSheet from "@/components/common/BottomSheet";

type Props = {
    initialItems: OpuCardModel[];
    onDeleteSelected?: (ids: number[]) => Promise<void> | void;
    // 하나만 해제(삭제)
    onUnblockOne?: (id: number) => Promise<void> | void;
};

export default function BlockedOpuList({
    initialItems,
    onDeleteSelected,
    onUnblockOne,
}: Props) {
    const [items, setItems] = useState<OpuCardModel[]>(initialItems);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [qInput, setQInput] = useState("");
    const [q, setQ] = useState("");

    // 모달/시트
    const [showConfirm, setShowConfirm] = useState(false);
    const [sheetItemId, setSheetItemId] = useState<number | null>(null);
    const closeSheet = () => setSheetItemId(null);

    // === 목록/검색 ===
    useEffect(() => {
        setItems(initialItems);
        setSelected((prev) => {
            const ids = new Set(initialItems.map((i) => i.id));
            const next = new Set<number>();
            prev.forEach((id) => ids.has(id) && next.add(id));
            return next;
        });
    }, [initialItems]);

    useEffect(() => {
        const t = setTimeout(() => setQ(qInput.trim().toLowerCase()), 250);
        return () => clearTimeout(t);
    }, [qInput]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return items;
        return items.filter((i) => i.title.toLowerCase().includes(query));
    }, [items, q]);

    const allIds = useMemo(() => filtered.map((i) => i.id), [filtered]);
    const allSelected =
        allIds.length > 0 && allIds.every((id) => selected.has(id));

    const toggleOne = useCallback((id: number, next: boolean) => {
        setSelected((prev) => {
            const s = new Set(prev);
            if (next) s.add(id);
            else s.delete(id);
            return s;
        });
    }, []);

    const toggleAllOnPage = (next: boolean) => {
        setSelected((prev) => {
            const s = new Set(prev);
            if (next) allIds.forEach((id) => s.add(id));
            else allIds.forEach((id) => s.delete(id));
            return s;
        });
    };

    // === 선택 삭제(일괄) ===
    const handleDeleteSelected = async () => {
        const ids = Array.from(selected);
        if (ids.length === 0) return;
        try {
            await onDeleteSelected?.(ids);
        } finally {
            setItems((prev) => prev.filter((i) => !selected.has(i.id)));
            setSelected(new Set());
            setShowConfirm(false);
        }
    };

    const handleAddTodo = (id: number) => {
        console.log("루틴 추가", id);
        closeSheet();
    };

    const handleUnblockOne = async (id: number) => {
        try {
            await onUnblockOne?.(id);
        } finally {
            setItems((prev) => prev.filter((i) => i.id !== id));
            setSelected((prev) => {
                const s = new Set(prev);
                s.delete(id);
                return s;
            });
            closeSheet();
        }
    };

    const sheetOptions = (id: number) => [
        { label: "투두리스트에 추가", onClick: () => handleAddTodo(id) },
        {
            label: "차단 해제",
            danger: true,
            onClick: () => handleUnblockOne(id),
        },
    ];

    return (
        <div className="flex flex-col gap-3 px-1">
            {/* 검색 + 선택바 */}
            <div className="flex flex-col gap-3">
                <SearchBar
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    onSubmit={(v) => setQInput(v)}
                    placeholder="차단 OPU 검색"
                    className="mt-5"
                />

                <div className="flex items-center justify-between mt-4">
                    <label className="inline-flex items-center gap-2 text-sm mx-2">
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
                            <p style={{ color: "var(--color-dark-gray)" }}>
                                ({selected.size}/{allIds.length})
                            </p>
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="h-7 px-2 rounded-md bg-[var(--color-opu-dark-green)] text-[12px] font-[var(--weight-medium)] text-white disabled:opacity-50"
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
            <div className="flex flex-col gap-3">
                {filtered.map((item) => (
                    <BlockedOpuCard
                        key={item.id}
                        item={item}
                        selectable
                        checked={selected.has(item.id)}
                        onCheckedChange={toggleOne}
                        onMore={(id) => setSheetItemId(id)}
                    />
                ))}

                {filtered.length === 0 && (
                    <div
                        className="text-center text-sm text-zinc-500 py-10"
                        style={{
                            fontSize: "var(--text-sub)",
                            color: "var(--color-light-gray)",
                        }}
                    >
                        차단한 OPU가 없습니다
                    </div>
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
