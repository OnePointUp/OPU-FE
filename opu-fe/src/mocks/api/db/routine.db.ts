import type { RoutineEntity } from "@/features/routine/domain";
import { CURRENT_MEMBER_ID } from "./member.db";

const now = new Date().toISOString();

export const MOCK_ROUTINES: RoutineEntity[] = [
    {
        id: 1,
        memberId: CURRENT_MEMBER_ID,
        title: "물 한 잔 마시기",
        frequency: "DAILY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: "09:00",
        color: "#FFC1E3",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 2,
        memberId: CURRENT_MEMBER_ID,
        title: "헬스장 가기",
        frequency: "DAILY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: "20:00",
        color: "#C1E3FF",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 3,
        memberId: CURRENT_MEMBER_ID,
        title: "미라클 모닝",
        frequency: "DAILY",
        startDate: "2025-11-30",
        endDate: "2025-12-31",
        time: "06:00",
        color: "#D2FFC1",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 4,
        memberId: CURRENT_MEMBER_ID,
        title: "낙성대공원 산책",
        frequency: "WEEKLY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: null,
        color: "#FFFAA2",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 5,
        memberId: CURRENT_MEMBER_ID,
        title: "야옹이 츄르 주기",
        frequency: "DAILY",
        startDate: "2025-10-27",
        endDate: "2025-12-31",
        time: null,
        color: "#CCFFF7",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 6,
        memberId: CURRENT_MEMBER_ID,
        title: "멍멍이 목욕 시키기",
        frequency: "MONTHLY",
        startDate: "2025-10-27",
        endDate: null,
        time: null,
        color: "#FFC99D",
        isActive: true,
        createdAt: now,
        updatedAt: now,
    },
];

export function nextRoutineId() {
    return MOCK_ROUTINES.length
        ? Math.max(...MOCK_ROUTINES.map((r) => r.id)) + 1
        : 1;
}
