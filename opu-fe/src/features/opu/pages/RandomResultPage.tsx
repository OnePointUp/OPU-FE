"use client";

import { useSearchParams } from "next/navigation";
import RandomResultClient from "./RandomResultClient";
import type { RandomScope, TimeCode } from "../domain";

export default function RandomResultPage() {
    const searchParams = useSearchParams();

    const rawScope = searchParams.get("scope");
    const rawTime = searchParams.get("time");
    const rawExclude = searchParams.get("excludeOpuId");

    const scope: RandomScope = rawScope === "FAVORITE" ? "FAVORITE" : "ALL";

    const validTimes: TimeCode[] = ["ALL", "1M", "5M", "30M", "1H", "DAILY"];
    const time: TimeCode = validTimes.includes(rawTime as TimeCode)
        ? (rawTime as TimeCode)
        : "ALL";

    const excludeOpuId = rawExclude ? Number(rawExclude) : undefined;

    console.log("[RandomResultPage(client)] scope, time =", scope, time);

    return (
        <RandomResultClient
            scope={scope}
            time={time}
            excludeOpuId={excludeOpuId}
        />
    );
}
