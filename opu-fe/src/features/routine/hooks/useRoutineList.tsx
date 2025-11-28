"use client";

import { useEffect, useState } from "react";
import type { RoutineEntity } from "../domain";
import { fetchRoutineList } from "../services";

export function useRoutineList() {
    const [items, setItems] = useState<RoutineEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await fetchRoutineList();
                if (!cancelled) {
                    setItems(data);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e as Error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return { items, loading, error };
}
