import { NextResponse, type NextRequest } from "next/server";
import { MOCK_ROUTINES } from "@/mocks/api/db/routine.db";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export async function GET(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const segments = pathname.split("/");
    const idStr = segments[segments.length - 1];
    const id = Number(idStr);

    console.log("[API] /api/routine/[id] pathname =", pathname);
    console.log("[API] parsed idStr =", idStr, "id =", id);

    // 파라미터 검증
    if (!idStr || Number.isNaN(id)) {
        return NextResponse.json(
            {
                message: "라우트 파라미터가 유효하지 않습니다.",
                debug: { idStr, id },
            },
            { status: 400 }
        );
    }

    console.log("[API LOG] MOCK_ROUTINES.length:", MOCK_ROUTINES.length);
    console.log("[API LOG] Searching for ID:", id);

    const routine = MOCK_ROUTINES.find(
        (r) => r.id === id && r.memberId === CURRENT_MEMBER_ID
    );

    if (!routine) {
        return NextResponse.json(
            {
                message: "루틴을 찾을 수 없습니다.",
                debug: { idStr, id },
            },
            { status: 404 }
        );
    }

    return NextResponse.json(routine);
}
