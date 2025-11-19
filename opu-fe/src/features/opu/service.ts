import { LIKE, OPU } from "@/mocks/api/db/opu.db";
import { OpuCardModel } from "./domain";
import { toOpuCardModelFromEntity } from "./mappers";

// 전체 OPU + 내 찜 여부
export async function fetchOpuCardsByMember(
    memberId: number
): Promise<OpuCardModel[]> {
    const likedSet = new Set(
        LIKE.filter((l) => l.member_id === memberId).map((l) => l.opu_id)
    );

    return OPU.map((o) => toOpuCardModelFromEntity(o, likedSet.has(o.id)));
}

// 내가 만든 OPU
export async function fetchMyOpuCards(
    memberId: number
): Promise<OpuCardModel[]> {
    const likedSet = new Set(
        LIKE.filter((l) => l.member_id === memberId).map((l) => l.opu_id)
    );

    return OPU.filter((o) => o.member_id === memberId).map((o) =>
        toOpuCardModelFromEntity(o, likedSet.has(o.id))
    );
}
