"use client";

import { useEffect, useState } from "react";
import { OpuMonthlyStatsResponse } from "../types";
import { fetchMonthlyOpuStats } from "../services";

type UseMonthlyOpuStatsParams = {
    year?: number;
    month?: number;
};

export function useOpuStats(params: UseMonthlyOpuStatsParams = {}) {
    const [data, setData] = useState<OpuMonthlyStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetchMonthlyOpuStats(params);
                if (cancelled) return;
                setData(res);
            } catch (e) {
                if (cancelled) return;
                console.error(e);
                setError(
                    e instanceof Error
                        ? e.message
                        : "월별 통계를 불러오지 못했어요."
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [params.year, params.month]);

    return { data, loading, error };
}
