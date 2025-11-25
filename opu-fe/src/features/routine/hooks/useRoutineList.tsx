"use client";

import { useEffect, useState } from "react";
import type { RoutineEntity } from "../domain";
import { fetchRoutineList } from "../services";

export function useRoutineList() {
    const [items, setItems] = useState<RoutineEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function run() {
            try {
                const list = await fetchRoutineList();
                setItems(list);
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        }

        run();
    }, []);

    return { items, loading, error };
}
