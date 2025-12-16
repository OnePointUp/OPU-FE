"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOpuCategories } from "../service";
import type { CategoriesResponse } from "../domain";
import { extractErrorMessage } from "@/utils/api-helpers";

type CategoryMap = Record<number, string>;

let cachedCategories: CategoriesResponse[] | null = null;
let pending: Promise<CategoriesResponse[]> | null = null;

function toMap(categories: CategoriesResponse[]): CategoryMap {
    return categories.reduce<CategoryMap>((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
    }, {});
}

export function useOpuCategories() {
    const [categories, setCategories] = useState<CategoriesResponse[]>(
        cachedCategories ?? []
    );
    const [loading, setLoading] = useState(!cachedCategories);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!pending) {
                pending = fetchOpuCategories().then((data) => {
                    cachedCategories = data;
                    return data;
                });
            }

            const data = await pending;
            setCategories(data);
        } catch (err: unknown) {
            setError(extractErrorMessage(err, "카테고리를 불러오지 못했어요."));
        } finally {
            setLoading(false);
            pending = null;
        }
    }, []);

    useEffect(() => {
        if (!cachedCategories) {
            void load();
        }
    }, [load]);

    const categoryMap = useMemo(() => toMap(categories), [categories]);

    return {
        categories,
        categoryMap,
        loading,
        error,
        refetch: load,
    };
}
