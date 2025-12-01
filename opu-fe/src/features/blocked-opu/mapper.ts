import { toTimeLabel } from "../opu/utils/time";
import { BlockedOpuSummaryDto } from "./types";
import { OpuCardModel } from "@/features/opu/domain";

export function toBlockedOpuCard(dto: BlockedOpuSummaryDto): OpuCardModel {
    return {
        id: dto.opuId,
        title: dto.title,
        emoji: dto.emoji,
        categoryId: dto.categoryId,
        categoryName: dto.categoryName,
        timeLabel: toTimeLabel(dto.requiredMinutes),
        liked: false,
        blockedAt: dto.blockedAt,
    };
}
