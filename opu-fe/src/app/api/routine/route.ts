import { NextResponse } from "next/server";
import { MOCK_ROUTINES, nextRoutineId } from "@/mocks/api/db/routine.db";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import type {
    CreateRoutinePayload,
    UpdateRoutinePayload,
} from "@/features/routine/types";

type RoutineListResponse = {
    items: typeof MOCK_ROUTINES;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 내 루틴 목록
export async function GET() {
    const items = MOCK_ROUTINES.filter((r) => r.memberId === CURRENT_MEMBER_ID);

    await delay(120);

    return NextResponse.json<RoutineListResponse>({
        items,
    });
}

// 루틴 생성
export async function POST(req: Request) {
    const body = (await req.json()) as CreateRoutinePayload;
    const now = new Date().toISOString();

    const newRoutine = {
        id: nextRoutineId(),
        memberId: CURRENT_MEMBER_ID,
        title: body.title,
        frequency: body.frequency,
        startDate: body.startDate,
        endDate: body.endDate ?? null,
        time: body.time ?? null,
        color: body.color,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    };

    MOCK_ROUTINES.push(newRoutine);
    await delay(120);
    return NextResponse.json(newRoutine, { status: 201 });
}

// 루틴 수정
export async function PUT(req: Request) {
    const body = (await req.json()) as UpdateRoutinePayload;
    const idx = MOCK_ROUTINES.findIndex(
        (r) => r.id === body.id && r.memberId === CURRENT_MEMBER_ID
    );
    if (idx < 0) {
        return NextResponse.json(
            { message: "루틴을 찾을 수 없습니다." },
            { status: 404 }
        );
    }

    const now = new Date().toISOString();
    const prev = MOCK_ROUTINES[idx];

    MOCK_ROUTINES[idx] = {
        ...prev,
        title: body.title ?? prev.title,
        frequency: body.frequency ?? prev.frequency,
        startDate: body.startDate ?? prev.startDate,
        endDate:
            body.endDate === undefined ? prev.endDate : body.endDate ?? null,
        time: body.time === undefined ? prev.time : body.time ?? null,
        color: body.color ?? prev.color,
        updatedAt: now,
    };

    await delay(120);
    return NextResponse.json(MOCK_ROUTINES[idx]);
}

// 루틴 삭제
export async function DELETE(req: Request) {
    const { id } = (await req.json()) as { id: number };
    const idx = MOCK_ROUTINES.findIndex(
        (r) => r.id === id && r.memberId === CURRENT_MEMBER_ID
    );
    if (idx < 0) {
        return NextResponse.json(
            { message: "루틴을 찾을 수 없습니다." },
            { status: 404 }
        );
    }
    MOCK_ROUTINES.splice(idx, 1);
    await delay(120);
    return NextResponse.json({ ok: true });
}
