"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RandomTimeStep from "@/features/opu/components/RandomTimeStep";
import { RandomScope, TimeCode, TIME_OPTIONS } from "../domain";
import { fetchRandomTimeSummary } from "../service";

type TimeValue = TimeCode | null;

export default function RandomTimePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const scope = (searchParams.get("scope") as RandomScope) ?? "ALL";

    const [timeCounts, setTimeCounts] = useState<Record<TimeCode, number>>(
        () => {
            const base = {} as Record<TimeCode, number>;
            TIME_OPTIONS.forEach((opt) => {
                base[opt.code] = 0;
            });
            return base;
        }
    );

    const [selectedTime, setSelectedTime] = useState<TimeValue>(null);

    useEffect(() => {
        async function load() {
            try {
                const source = scope;
                const summary = await fetchRandomTimeSummary(source);
                setTimeCounts(summary);
            } catch (e) {
                console.error("failed to fetch time summary", e);
            }
        }

        void load();
    }, [scope]);

    return (
        <RandomTimeStep
            value={selectedTime}
            onChange={setSelectedTime}
            timeCounts={timeCounts}
            onSubmit={() => {
                if (!selectedTime) return;
                router.push(
                    `/opu/random/result?scope=${scope}&time=${selectedTime}`
                );
            }}
        />
    );
}
