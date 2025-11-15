import { OPU, LIKE } from "@/mocks/api/db/opu.db";
import type { OpuCardModel, OpuEntity } from "@/features/opu/domain";
import { toOpuCardModelFromEntity } from "../opu/mappers";

export async function getLikedOpuList(
    memberId: number,
    q = ""
): Promise<OpuCardModel[]> {
    const liked = LIKE.filter((l) => l.member_id === memberId);

    const joined = liked
        .map((l) => {
            const opu = OPU.find((o) => o.id === l.opu_id);
            return opu ? { opu, likedAt: l.created_at } : null;
        })
        .filter((x): x is { opu: OpuEntity; likedAt: string } => x !== null);

    let models = joined.map(({ opu }) => toOpuCardModelFromEntity(opu, true));

    const query = q.trim().toLowerCase();
    if (query)
        models = models.filter((m) => m.title.toLowerCase().includes(query));

    // 최신 찜순 (LIKE.created_at desc)
    models.sort((a, b) => {
        const la = liked.find((l) => l.opu_id === a.id)?.created_at ?? "";
        const lb = liked.find((l) => l.opu_id === b.id)?.created_at ?? "";
        return lb.localeCompare(la);
    });

    return models;
}
