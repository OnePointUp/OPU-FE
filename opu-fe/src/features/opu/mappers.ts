import { OpuCardModel, OpuSummaryResponse, RandomOpuResponse } from "./domain";
import { mapMinutesToLabel } from "./domain";

export function toOpuCardModelFromSummary(o: OpuSummaryResponse): OpuCardModel {
    return {
        id: o.id,
        title: o.title,
        description: o.description,
        emoji: o.emoji,
        categoryId: o.categoryId,
        categoryName: o.categoryName,

        timeLabel: mapMinutesToLabel(o.requiredMinutes),

        completedCount: o.myCompletionCount,
        isLiked: o.favorite,
        likeCount: o.favoriteCount,

        isShared: o.isShared,

        creatorId: o.creatorId,
        creatorNickname: o.creatorNickname,
        isMine: o.isMine,
    };
}

export function toOpuCardModelFromRandom(o: RandomOpuResponse): OpuCardModel {
    return {
        id: o.id,
        title: o.title,
        description: o.description,
        emoji: o.emoji,
        categoryId: o.categoryId,
        categoryName: o.categoryName,

        timeLabel: mapMinutesToLabel(o.requiredMinutes),

        completedCount: o.myCompletionCount,
        isLiked: o.favorite,
        likeCount: o.favoriteCount,

        isShared: o.isShared,

        creatorId: o.creatorId,
        creatorNickname: o.creatorNickname,
        isMine: o.isMine,
    };
}
