import { COMPLETED_COUNT, LIKE } from "@/mocks/api/db/opu.db";

import { CURRENT_MEMBER_ID, MEMBER_NICKNAME } from "@/mocks/api/db/member.db";
import {
    OpuCardModel,
    OpuEntity,
    toCategoryName,
    toPeriodLabelFromCode,
} from "./domain";

export const toShareLabel = (isShared: OpuEntity["is_shared"]) =>
    isShared === "Y" ? "공유됨" : "비공유";

export const isLocked = (o: { is_shared: OpuEntity["is_shared"] }) =>
    o.is_shared !== "Y";

function getLikedCount(opuId: number): number {
    const memberSet = new Set(
        LIKE.filter((l) => l.opu_id === opuId).map((l) => l.member_id)
    );
    return memberSet.size;
}

export function toOpuCardModelFromEntity(
    o: OpuEntity,
    liked: boolean
): OpuCardModel {
    const creatorId = o.member_id;
    const isMine = creatorId === CURRENT_MEMBER_ID;
    const creatorNickname =
        creatorId != null ? MEMBER_NICKNAME[creatorId] : undefined;

    return {
        id: o.id,
        title: o.title,
        categoryId: o.category_id,
        categoryName: toCategoryName(o.category_id),
        periodLabel: toPeriodLabelFromCode(o.required_time),
        completedCount: COMPLETED_COUNT[o.id],
        locked: isLocked(o),
        liked,
        likedCount: getLikedCount(o.id),

        shareLabel: toShareLabel(o.is_shared),
        createdAt: o.created_at,
        emoji: o.emoji,

        isMine,
        creatorId: creatorId ?? undefined,
        creatorNickname,
    };
}
