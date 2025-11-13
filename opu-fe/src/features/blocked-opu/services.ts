import { listBlockedOpu, unblock } from "@/mocks/api/handler/blockedOpu";
import { toOpuCardModelFromBlockedJoin } from "@/features/opu/mappers";
import type { OpuCardModel } from "@/types/opu";

// 차단된 OPU 리스트
export async function getBlockedOpuList(
    memberId: number,
    q = ""
): Promise<OpuCardModel[]> {
    const rows = listBlockedOpu(memberId, q);
    return rows.map(toOpuCardModelFromBlockedJoin);
}

// 차단 해제
export async function deleteBlockedOpu(memberId: number, opuId: number) {
    unblock(memberId, opuId);
}
