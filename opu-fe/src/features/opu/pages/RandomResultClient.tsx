"use client";

import { useEffect, useState } from "react";
import RandomResultView from "../components/RandomResultView";
import RandomOpuLoadingScreen from "../components/RandomOpuLoadingScreen";

import type { OpuCardModel, RandomScope, TimeCode } from "../domain";
import { drawRandomOpu } from "../service";

type Props = {
    scope: RandomScope;
    time: TimeCode;
    excludeOpuId?: number;
};

export default function RandomResultClient({
    scope,
    time,
    excludeOpuId,
}: Props) {
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<OpuCardModel | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        async function load() {
            console.log("[RandomResultClient] scope, time =", scope, time);

            try {
                const opu = await drawRandomOpu(scope, time, excludeOpuId);
                setItem(opu);
                timer = setTimeout(() => setLoading(false), 1000);
            } catch (e) {
                console.error(e);
                setItem(null);
                setLoading(false);
            }
        }

        load();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [scope, time, excludeOpuId]);

    if (loading) return <RandomOpuLoadingScreen />;

    if (!item) {
        return (
            <div className="flex items-center justify-center text-[var(--color-dark-gray)]">
                조건에 맞는 OPU가 없어요
            </div>
        );
    }

    return <RandomResultView item={item} />;
}
