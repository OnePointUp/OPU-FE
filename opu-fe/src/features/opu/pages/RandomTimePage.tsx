"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import RandomTimeStep from "@/features/opu/components/RandomTimeStep";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import { getTimeCountsByScope, type RandomScope } from "@/features/opu/random";
import type { TimeCode } from "@/features/opu/utils/time";

type TimeValue = TimeCode | null;

export default function RandomTimePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const scope = (searchParams.get("scope") as RandomScope) ?? "ALL";

    const timeCounts = useMemo(
        () => getTimeCountsByScope(CURRENT_MEMBER_ID, scope),
        [scope]
    );

    const [selectedTime, setSelectedTime] = useState<TimeValue>(null);

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
