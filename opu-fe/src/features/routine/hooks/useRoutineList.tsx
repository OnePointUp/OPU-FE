"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRoutineList } from "../services";
import type { RoutineEntity } from "../domain";

export function useRoutineList() {
    const [items, setItems] = useState<RoutineEntity[]>([]);
    const [loading, setLoading] = useState(false);

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchRoutineList();
            setItems(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeById = useCallback((id: number) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }, []);

    useEffect(() => {
        void reload();
    }, [reload]);

    return { items, loading, reload, removeById };
}
