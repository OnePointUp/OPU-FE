import { listBlockedOpu, unblock } from "@/mocks/api/handler/blockedOpu";
import {
    OpuCardModel,
    OpuEntity,
    toCategoryName,
    toPeriodLabelFromCode,
} from "@/features/opu/domain";
import { COMPLETED_COUNT } from "@/mocks/api/db/opu.db";

// 차단 OPU 조인 결과 타입
type BlockedJoin = {
    opu_id: number;
    opu_title: string;
    opu_category_id: number | null;
    opu_required_time: OpuEntity["required_time"];
    opu_is_shared: boolean;
    blocked_at: string;
    emoji: string;
};

// 차단 OPU 조인 결과 → 카드 뷰 모델 변환
function toOpuCardModelFromBlockedJoin(j: BlockedJoin): OpuCardModel {
    return {
        id: j.opu_id,
        title: j.opu_title,
        categoryId: j.opu_category_id ?? 0,
        categoryName: j.opu_category_id
            ? toCategoryName(j.opu_category_id)
            : "기타",
        periodLabel: toPeriodLabelFromCode(j.opu_required_time),
        completedCount: COMPLETED_COUNT[j.opu_id] ?? 0,
        locked: !j.opu_is_shared,
        liked: false,
        shareLabel: j.opu_is_shared ? "공유됨" : "비공유",
        createdAt: j.blocked_at,
        emoji: j.emoji,
    };
}

// 차단 OPU 목록 조회
export async function getBlockedOpuList(
    memberId: number,
    q = ""
): Promise<OpuCardModel[]> {
    const rows = listBlockedOpu(memberId, q) as BlockedJoin[];
    return rows.map(toOpuCardModelFromBlockedJoin);
}

// 차단 해제
export function deleteBlockedOpu(memberId: number, opuId: number) {
    unblock(memberId, opuId);
}
