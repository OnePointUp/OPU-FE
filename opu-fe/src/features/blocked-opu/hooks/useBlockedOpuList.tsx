"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { OpuCardModel } from "@/features/opu/domain";

type UseBlockedOpuListArgs = {
    initialItems: OpuCardModel[];
    onDeleteSelected?: (ids: number[]) => Promise<void> | void;
    onUnblockOne?: (id: number) => Promise<void> | void;
};

export function useBlockedOpuList({
    initialItems,
    onDeleteSelected,
    onUnblockOne,
}: UseBlockedOpuListArgs) {
    const [items, setItems] = useState<OpuCardModel[]>(initialItems);
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const [qInput, setQInput] = useState("");
    const [q, setQ] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [sheetItemId, setSheetItemId] = useState<number | null>(null);

    const closeSheet = () => setSheetItemId(null);

    // initialItems 변경 시 동기화
    useEffect(() => {
        setItems(initialItems);
        setSelected((prev) => {
            const ids = new Set(initialItems.map((i) => i.id));
            const next = new Set<number>();
            prev.forEach((id) => ids.has(id) && next.add(id));
            return next;
        });
    }, [initialItems]);

    // 검색 debounce
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

    const toggleAllOnPage = useCallback(
        (next: boolean) => {
            setSelected((prev) => {
                const s = new Set(prev);
                if (next) allIds.forEach((id) => s.add(id));
                else allIds.forEach((id) => s.delete(id));
                return s;
            });
        },
        [allIds]
    );

    const handleDeleteSelected = useCallback(async () => {
        const ids = Array.from(selected);
        if (ids.length === 0) return;
        try {
            await onDeleteSelected?.(ids);
        } finally {
            setItems((prev) => prev.filter((i) => !selected.has(i.id)));
            setSelected(new Set());
            setShowConfirm(false);
        }
    }, [onDeleteSelected, selected]);

    const handleAddTodo = useCallback((id: number) => {
        console.log("루틴 추가", id);
        closeSheet();
    }, []);

    const handleUnblockOne = useCallback(
        async (id: number) => {
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
        },
        [onUnblockOne]
    );

    const openSheetFor = (id: number) => setSheetItemId(id);

    return {
        // 상태
        items,
        filtered,
        selected,
        qInput,
        allSelected,
        allIds,
        showConfirm,
        sheetItemId,
        // setter/핸들러
        setQInput,
        setShowConfirm,
        toggleOne,
        toggleAllOnPage,
        handleDeleteSelected,
        handleAddTodo,
        handleUnblockOne,
        openSheetFor,
        closeSheet,
    };
}
