import { LIKE, OPU } from "@/mocks/api/db/opu.db";
import type { OpuCardModel } from "@/features/opu/domain";
import { toOpuCardModelFromEntity } from "@/features/opu/mappers";
import { BlockedJoin } from "../blocked-opu/services";
import { listBlockedOpu } from "@/mocks/api/handler/blockedOpu";

export async function fetchLikedOpuCards(
    memberId: number
): Promise<OpuCardModel[]> {
    const likedOpuIds = LIKE.filter((l) => l.member_id === memberId).map(
        (l) => l.opu_id
    );
    const likedSet = new Set(likedOpuIds);

    const blockedRows = listBlockedOpu("") as BlockedJoin[];
    const blockedSet = new Set(blockedRows.map((b) => b.opu_id));

    return OPU.filter((o) => likedSet.has(o.id))
        .filter((o) => !blockedSet.has(o.id))
        .map((o) => toOpuCardModelFromEntity(o, true));
}
