import type { OpuCardModel, OpuEntity } from "@/types/opu";
import { COMPLETED_COUNT } from "@/mocks/api/db/opu.db";

// 카테고리명
const CATEGORY_MAP: Record<number, string> = {
    1: "🌱 자기계발",
    2: "🧘 마음건강",
    3: "👥 관계&소통",
    4: "💡 창의활동",
    5: "🏋️ 신체활동",
    6: "🍽️ 식습관",
    7: "🎨 문화생활",
    8: "📚 지식확장",
    9: "💰 경제습관",
    10: "🏡 생활습관",
    11: "🛌 휴식&재충전",
    12: "💞 자기이해",
    13: "🎯 도전&성취",
};
export const toCategoryName = (id: number) => CATEGORY_MAP[id] ?? "기타";

// 기간 라벨
export function toPeriodLabelFromCode(rt: OpuEntity["required_time"]) {
    const map: Record<OpuEntity["required_time"], string> = {
        "1M": "1분",
        "5M": "5분",
        "30M": "30분",
        "1H": "1시간",
        DAILY: "1일",
    };
    return map[rt] ?? "기타";
}

export const toShareLabel = (isShared: OpuEntity["is_shared"]) =>
    isShared === "Y" ? "공유됨" : "비공유";

export const isLocked = (o: { is_shared: OpuEntity["is_shared"] }) =>
    o.is_shared !== "Y";

// 일반 OPU 엔터티 → 카드 모델
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

// 차단 OPU 조인 응답 타입
export type BlockedJoin = {
    opu_id: number;
    opu_title: string;
    opu_category_id: number | null;
    opu_required_time: string;
    opu_is_shared: boolean;
    blocked_at: string;
    emoji: string;
};

// 차단 OPU 조인 응답 → 카드 모델
export function toOpuCardModelFromBlockedJoin(j: BlockedJoin): OpuCardModel {
    return {
        id: j.opu_id,
        title: j.opu_title,
        categoryId: j.opu_category_id ?? 0,
        categoryName: j.opu_category_id
            ? toCategoryName(j.opu_category_id)
            : "기타",
        periodLabel: toPeriodLabelFromCode(
            j.opu_required_time as OpuEntity["required_time"]
        ),
        completedCount: COMPLETED_COUNT[j.opu_id] ?? 0,
        locked: !j.opu_is_shared,
        liked: false,
        shareLabel: j.opu_is_shared ? "공유됨" : "비공유",
        createdAt: j.blocked_at,
        emoji: j.emoji,
    };
}
