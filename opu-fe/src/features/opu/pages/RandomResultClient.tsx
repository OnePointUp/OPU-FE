"use client";

import { useEffect, useState } from "react";
import RandomResultView from "../components/RandomResultView";
import RandomOpuLoadingScreen from "../components/RandomOpuLoadingScreen";

import {
    type OpuCardModel,
    type RandomScope,
    type TimeCode,
    TIME_CODE_TO_MINUTES,
} from "@/features/opu/domain";
import { fetchRandomOpu } from "../service";
import { toOpuCardModelFromRandom } from "../mappers";

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
        let timer: NodeJS.Timeout;

        async function load() {
            try {
                const requiredMinutes =
                    time === "ALL"
                        ? undefined
                        : TIME_CODE_TO_MINUTES[
                              time as Exclude<TimeCode, "ALL">
                          ];

                const res = await fetchRandomOpu({
                    source: scope === "LIKED" ? "FAVORITE" : "ALL",
                    requiredMinutes,
                    excludeOpuId,
                });
                if (res) {
                    setItem(toOpuCardModelFromRandom(res));
                } else {
                    setItem(null);
                }

                timer = setTimeout(() => setLoading(false), 1000);
            } catch (e) {
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
