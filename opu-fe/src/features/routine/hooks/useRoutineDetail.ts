"use client";

import { useEffect, useState } from "react";
import { fetchRoutineDetail } from "../services";

type Routine = Awaited<ReturnType<typeof fetchRoutineDetail>>;

export function useRoutineDetail(id: number) {
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (id == null) return;

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchRoutineDetail(id);
                if (cancelled) return;
                setRoutine(data);
            } catch (err) {
                if (cancelled) return;
                setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { routine, loading, error };
}
