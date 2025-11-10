import { NextResponse } from "next/server";

export async function GET() {
    const mockUser = {
        nickname: "김진영",
        email: "kimjy3520@gmail.com",
        bio: "하루 한 걸음씩 성장 중입니다 🌿",
        profileImageUrl: "",
    };

    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(mockUser);
}

export async function POST(req: Request) {
    const form = await req.formData();
    const nickname = String(form.get("nickname") ?? "");
    const bio = String(form.get("bio") ?? "");
    // const file = form.get("profileImage") as File | null; // 파일 필요 시 처리

    // 실제에선 DB 업데이트
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json({ ok: true, nickname, bio });
}

export const PUT = POST;
