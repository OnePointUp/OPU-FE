"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRoutineList } from "../services";
import { RoutineListItemResponse } from "../types";

export function useRoutineListPage() {
    const [items, setItems] = useState<RoutineListItemResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchRoutineList();
            setItems(data.content);
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
