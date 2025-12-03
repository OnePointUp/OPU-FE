import { OPU, LIKE } from "@/mocks/api/db/opu.db";
import { TIME_OPTIONS, type OpuCardModel, type TimeCode } from "./domain";
import { apiClient } from "@/lib/apiClient";
import { fetchProfileSummary } from "../user/services";

export type RandomScope = "ALL" | "LIKED";

export async function drawRandomOpu(
    scope: RandomScope,
    time: TimeCode
): Promise<OpuCardModel | null> {
    const res = await apiClient.get<OpuCardModel | null>("/opus/random", {
        params: {
            scope,
            time,
        },
    });

    return res.data;
}

export async function getLikedCountByMember(): Promise<number> {
    const summary = await fetchProfileSummary();
    return summary.favoriteOpuCount;
}

export function getTimeCountsByScope(
    memberId: number,
    scope: RandomScope
): Record<TimeCode, number> {
    const likedSet = new Set(
        LIKE.filter((l) => l.member_id === memberId).map((l) => l.opu_id)
    );

    const pool = OPU.filter((o) =>
        scope === "ALL" ? true : likedSet.has(o.id)
    );

    const result = Object.fromEntries(
        TIME_OPTIONS.map((opt) => [opt.code, 0])
    ) as Record<TimeCode, number>;

    for (const o of pool) {
        result.ALL += 1;
        result[o.required_time] += 1;
    }

    return result;
}
