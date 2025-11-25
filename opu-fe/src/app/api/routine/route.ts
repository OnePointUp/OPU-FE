import { NextResponse } from "next/server";
import type {
    RoutineEntity,
    RoutineFrequency,
} from "@/features/routine/domain";

const now = new Date().toISOString();

const MOCK_ROUTINES: RoutineEntity[] = [
    {
        id: 1,
        memberId: 1,
        title: "물 한 잔 마시기",
        frequency: "DAILY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: "09:00:00",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 2,
        memberId: 1,
        title: "헬스장 가기",
        frequency: "DAILY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: "20:00:00",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 3,
        memberId: 1,
        title: "미라클 모닝",
        frequency: "DAILY",
        startDate: "2025-11-30", // 미래 날짜 -> 시작 전
        endDate: "2025-12-31",
        time: "06:00:00",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 4,
        memberId: 1,
        title: "낙성대공원 산책",
        frequency: "WEEKLY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 5,
        memberId: 1,
        title: "야옹이 츄르 주기",
        frequency: "DAILY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 6,
        memberId: 1,
        title: "멍멍이 목욕 시키기",
        frequency: "MONTHLY",
        startDate: "2025-10-27",
        endDate: null,
        time: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
];

export async function GET() {
    // 실제 백엔드 붙이면 여기서 DB 조회해서 같은 형태로 리턴하면 됨
    return NextResponse.json({ items: MOCK_ROUTINES });
}
