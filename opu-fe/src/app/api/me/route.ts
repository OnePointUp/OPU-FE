import { NextResponse } from "next/server";

export async function GET() {
    const mockUser = {
        nickname: "김진영",
        email: "kimjy3520@gmail.com",
        introduction: "하루 한 걸음씩 성장 중입니다 🌿",
        profileImageUrl: "",
    };

    await new Promise((r) => setTimeout(r, 400));

    return NextResponse.json(mockUser);
}
