import { OPU, LIKE } from "@/mocks/api/db/opu.db";
import { toOpuCardModelFromSummary } from "./mappers";
import type { OpuCardModel } from "./domain";
import { TIME_OPTIONS, type TimeCode } from "./utils/time";

export type RandomScope = "ALL" | "LIKED";

export async function drawRandomOpu(
    memberId: number,
    scope: RandomScope,
    time: TimeCode
): Promise<OpuCardModel | null> {
    // 1) 내가 찜한 OPU id 세트
    const likedSet = new Set(
        LIKE.filter((l) => l.member_id === memberId).map((l) => l.opu_id)
    );

    // 2) scope + time 조건으로 풀 만들기
    const pool = OPU.filter((o) => {
        // 범위: 찜 목록만
        if (scope === "LIKED" && !likedSet.has(o.id)) {
            return false;
        }

        // 시간: ALL 아니면 required_time 일치하는 것만
        if (time !== "ALL" && o.required_time !== time) {
            return false;
        }

        return true;
    });

    // 조건에 맞는 게 하나도 없으면 null
    if (pool.length === 0) return null;

    // 3) 랜덤 인덱스로 하나 뽑기
    const idx = Math.floor(Math.random() * pool.length);
    const picked = pool[idx];

    const liked = likedSet.has(picked.id);

    // 4) 카드 모델로 변환
    return toOpuCardModelFromSummary(picked, liked);
}

export function getLikedCountByMember(memberId: number): number {
    return LIKE.filter((l) => l.member_id === memberId).length;
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
