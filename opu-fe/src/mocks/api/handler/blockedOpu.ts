import { BLOCKED_OPU, OPU } from "@/mocks/api/db/opu.db";

export type BlockedOpuResponse = {
    opu_id: number;
    opu_title: string;
    opu_category_id: number;
    opu_required_time: string;
    opu_is_shared: boolean;
    member_id: number;
    blocked_at: string;
    emoji: string;
};

// 차단된 OPU 목록 조회
export function listBlockedOpu(memberId: number, q = ""): BlockedOpuResponse[] {
    let rows = BLOCKED_OPU.filter((b) => b.member_id === memberId)
        .map((b) => {
            const o = OPU.find((x) => x.id === b.opu_id);
            if (!o) return null;

            return {
                opu_id: o.id,
                opu_title: o.title,
                opu_category_id: o.category_id,
                opu_required_time: o.required_time,
                opu_is_shared: o.is_shared === "Y",
                member_id: b.member_id,
                blocked_at: b.created_at,
                emoji: o.emoji,
            } satisfies BlockedOpuResponse;
        })
        .filter(Boolean) as BlockedOpuResponse[];

    if (q) {
        const lower = q.trim().toLowerCase();
        rows = rows.filter((r) => r.opu_title.toLowerCase().includes(lower));
    }

    return rows;
}

// 차단 해제
export function unblock(memberId: number, opuId: number) {
    const idx = BLOCKED_OPU.findIndex(
        (b) => b.member_id === memberId && b.opu_id === opuId
    );
    if (idx >= 0) BLOCKED_OPU.splice(idx, 1);
}
