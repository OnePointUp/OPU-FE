"use client";

import { useEffect, useState } from "react";
import BlockedOpuList from "@/features/blocked-opu/components/BlockedOpuList";
import type { OpuCardModel } from "@/features/opu/domain";
import {
    getBlockedOpuList,
    deleteBlockedOpu,
    deleteBlockedOpuBulk,
} from "../services";
import { toastError, toastSuccess } from "@/lib/toast";

export default function BlockedOpuManagePage() {
    const [items, setItems] = useState<OpuCardModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getBlockedOpuList();
                setItems(data);
            } catch (err) {
                console.error(err);
                toastError("차단한 OPU 목록을 불러오지 못했어요.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleUnblockOne = async (id: number) => {
        try {
            await deleteBlockedOpu(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toastSuccess("OPU 차단을 해제했어요.");
        } catch (err) {
            console.error(err);
            toastError("OPU 차단 해제에 실패했어요.");
        }
    };

    const handleDeleteSelected = async (ids: number[]) => {
        if (ids.length === 0) return;
        try {
            await deleteBlockedOpuBulk(ids);
            setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
            toastSuccess("선택한 OPU 차단을 해제했어요.");
        } catch (err) {
            console.error(err);
            toastError("선택한 OPU 차단 해제에 실패했어요.");
        }
    };

    return (
        <BlockedOpuList
            initialItems={items}
            loading={loading}
            onUnblockOne={handleUnblockOne}
            onDeleteSelected={handleDeleteSelected}
        />
    );
}
