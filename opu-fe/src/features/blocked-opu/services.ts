import { OpuCardModel, OpuEntity, toCategoryName } from "@/features/opu/domain";
import { COMPLETED_COUNT } from "@/mocks/api/db/opu.db"; // 실제 API에서 내려주면 이 부분도 나중에 제거 가능
import { mapTimeToLabel } from "../opu/utils/time";
import { requestJSON } from "@/lib/request";

const BASE = "/api/me/blocked-opu";

// 차단 OPU 조인 결과 타입
export type BlockedJoin = {
    opu_id: number;
    opu_title: string;
    opu_category_id: number | null;
    opu_required_time: OpuEntity["required_time"];
    opu_is_shared: boolean;
    blocked_at: string;
    emoji: string;
};

// 차단 OPU 조인 결과 -> 카드 뷰 모델 변환
function toOpuCardModelFromBlockedJoin(j: BlockedJoin): OpuCardModel {
    return {
        id: j.opu_id,
        title: j.opu_title,
        categoryId: j.opu_category_id ?? 0,
        categoryName: j.opu_category_id
            ? toCategoryName(j.opu_category_id)
            : "기타",
        timeLabel: mapTimeToLabel(j.opu_required_time),
        completedCount: COMPLETED_COUNT[j.opu_id] ?? 0,
        locked: !j.opu_is_shared,
        liked: false,
        shareLabel: j.opu_is_shared ? "공유됨" : "비공유",
        createdAt: j.blocked_at,
        emoji: j.emoji,
    };
}

// ==== 차단 OPU 목록 조회 ====
export async function getBlockedOpuList(q = ""): Promise<OpuCardModel[]> {
    const params = new URLSearchParams();
    if (q) params.set("q", q);

    const url = params.toString() ? `${BASE}?${params.toString()}` : BASE;
    const rows = await requestJSON<BlockedJoin[]>(url);
    return rows.map(toOpuCardModelFromBlockedJoin);
}

export function deleteBlockedOpu(opuId: number) {
    const url = `${BASE}/${opuId}`;
    return requestJSON<void>(url, { method: "DELETE" });
}
