"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import type { OpuCardModel } from "@/types/opu";
import BlockedOpuCard from "./BlockedOpuCard";
import ConfirmModal from "@/components/common/ConfirmModal";

type Props = {
    initialItems: OpuCardModel[];
    onDeleteSelected?: (ids: number[]) => Promise<void> | void; // 실제 삭제 API 연결시 사용
};

export default function BlockedOpuList({
    initialItems,
    onDeleteSelected,
}: Props) {
    const [items, setItems] = useState<OpuCardModel[]>(initialItems);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [qInput, setQInput] = useState("");
    const [q, setQ] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
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
                        onConfirm={handleDelete}
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
                        onMore={(id) => console.log("more", id)}
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
        </div>
    );
}
