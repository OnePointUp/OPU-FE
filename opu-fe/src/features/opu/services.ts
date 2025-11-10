import { LikeEntity, OpuCardModel, OpuEntity } from "@/types/opu";

// --- mock DB ---
const OPU: OpuEntity[] = [
    {
        id: 1,
        category_id: 6,
        created_by: 101,
        title: "물 2L 마시기",
        description: "하루 두 번 1L씩 나눠 마시기",
        created_at: "2025-11-01T00:00:00Z",
        required_time: "DAILY",
        is_shared: "Y",
    },
    {
        id: 2,
        category_id: 2,
        created_by: 102,
        title: "명상 10분 하기",
        description: "아침 명상",
        created_at: "2025-11-03T00:00:00Z",
        required_time: "5M",
        is_shared: "N",
    },
    {
        id: 3,
        category_id: 1,
        created_by: 101,
        title: "독서 20분 하기",
        description: "자기계발서 읽기",
        created_at: "2025-11-05T00:00:00Z",
        required_time: "30M",
        is_shared: "Y",
    },
];

const LIKE: LikeEntity[] = [
    { id: 11, member_id: 101, opu_id: 1, created_at: "2025-11-06T09:00:00Z" },
    { id: 12, member_id: 101, opu_id: 3, created_at: "2025-11-07T09:00:00Z" },
    { id: 13, member_id: 102, opu_id: 2, created_at: "2025-11-08T09:00:00Z" },
];

// 진행 횟수 목데이터
const COMPLETED_COUNT: Record<number, number> = { 1: 35, 2: 12, 3: 7 };

// 카테고리명 매핑
function toCategoryName(categoryId: number) {
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
    return CATEGORY_MAP[categoryId] ?? "기타";
}

// required_time → 라벨 변환
function toPeriodLabel(rt: OpuEntity["required_time"]) {
    const map: Record<OpuEntity["required_time"], string> = {
        "1M": "1분",
        "5M": "5분",
        "30M": "30분",
        "1H": "1시간",
        DAILY: "1일",
    };
    return map[rt] ?? "기타";
}

export function toShareLabel(isShared: OpuEntity["is_shared"]) {
    return isShared === "Y" ? "공유됨" : "비공유";
}

/** 공유면 잠금 해제, 비공유면 잠금 표시 */
export function isLocked(opu: OpuEntity) {
    return opu.is_shared !== "Y";
}

// ---------- 엔터티 → 카드 모델 변환 ----------
export function toOpuCardModel(o: OpuEntity, liked: boolean): OpuCardModel {
    return {
        id: o.id,
        title: o.title,
        categoryId: o.category_id,
        categoryName: toCategoryName(o.category_id),
        periodLabel: toPeriodLabel(o.required_time),
        completedCount: COMPLETED_COUNT[o.id],
        locked: isLocked(o),
        liked,
        shareLabel: toShareLabel(o.is_shared),
    };
}

// ---------- 서비스: 회원 기준 조인 ----------
export async function fetchOpuCardsByMember(
    memberId: number
): Promise<OpuCardModel[]> {
    const likedSet = new Set(
        LIKE.filter((l) => l.member_id === memberId).map((l) => l.opu_id)
    );
    return OPU.map((o) => toOpuCardModel(o, likedSet.has(o.id)));
}
