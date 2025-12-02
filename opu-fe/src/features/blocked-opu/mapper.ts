import { BlockedOpuSummaryResponse } from "./types";
import { mapMinutesToLabel, OpuCardModel } from "@/features/opu/domain";

export function toBlockedOpuCard(dto: BlockedOpuSummaryResponse): OpuCardModel {
    return {
        id: dto.opuId,
        title: dto.title,
        emoji: dto.emoji,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        timeLabel: mapMinutesToLabel(dto.requiredMinutes),
        isLiked: false,
        blockedAt: dto.blockedAt,
    };
}
