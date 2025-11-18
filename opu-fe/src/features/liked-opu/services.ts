import { LIKE, OPU } from "@/mocks/api/db/opu.db";
import type { OpuCardModel } from "@/features/opu/domain";
import { toOpuCardModelFromEntity } from "@/features/opu/mappers";

export async function fetchLikedOpuCards(
    memberId: number
): Promise<OpuCardModel[]> {
    const likedOpuIds = LIKE.filter((l) => l.member_id === memberId).map(
        (l) => l.opu_id
    );
    const likedSet = new Set(likedOpuIds);

    return OPU.filter((o) => likedSet.has(o.id)).map((o) =>
        toOpuCardModelFromEntity(o, true)
    );
}
