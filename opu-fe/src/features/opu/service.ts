import { LIKE, OPU } from "@/mocks/api/db/opu.db";
import { OpuCardModel } from "./domain";
import { toOpuCardModelFromEntity } from "./mappers";

export async function fetchOpuCardsByMember(
    memberId: number
): Promise<OpuCardModel[]> {
    const likedSet = new Set(
        LIKE.filter((l) => l.member_id === memberId).map((l) => l.opu_id)
    );

    return OPU.map((o) => toOpuCardModelFromEntity(o, likedSet.has(o.id)));
}
