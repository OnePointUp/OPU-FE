import { COMPLETED_COUNT } from "@/mocks/api/db/opu.db";
import {
    type OpuCardModel,
    type OpuEntity,
    toCategoryName,
    toPeriodLabelFromCode,
} from "./domain";

// === OPU 목록 ===
export const toShareLabel = (isShared: OpuEntity["is_shared"]) =>
    isShared === "Y" ? "공유됨" : "비공유";

export const isLocked = (o: { is_shared: OpuEntity["is_shared"] }) =>
    o.is_shared !== "Y";

export function toOpuCardModelFromEntity(
    o: OpuEntity,
    liked: boolean
): OpuCardModel {
    return {
        id: o.id,
        title: o.title,
        categoryId: o.category_id,
        categoryName: toCategoryName(o.category_id),
        periodLabel: toPeriodLabelFromCode(o.required_time),
        completedCount: COMPLETED_COUNT[o.id],
        locked: isLocked(o),
        liked,
        shareLabel: toShareLabel(o.is_shared),
        createdAt: o.created_at,
        emoji: o.emoji,
    };
}
