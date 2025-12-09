"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import RandomTimeStep from "@/features/opu/components/RandomTimeStep";
import { RandomScope, TimeCode, TIME_OPTIONS } from "../domain";

type TimeValue = TimeCode | null;

export default function RandomTimePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const scope = (searchParams.get("scope") as RandomScope) ?? "ALL";

    // TODO: 나중에 백엔드에서 시간대별 개수 내려주면 여기서 실제 값으로 교체
    const timeCounts = useMemo(
        () =>
            TIME_OPTIONS.reduce((acc, opt) => {
                // 일단 모든 시간 옵션을 "사용 가능" 상태로 1개씩 세팅
                acc[opt.code] = 1;
                return acc;
            }, {} as Record<TimeCode, number>),
        []
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
