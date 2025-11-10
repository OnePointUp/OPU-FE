import { NextResponse } from "next/server";

const REAL_CURRENT = "correct-password"; // 데모용

export async function POST(req: Request) {
    const { currentPassword } = await req.json();
    await new Promise((r) => setTimeout(r, 300));
    if (currentPassword !== REAL_CURRENT) {
        return new NextResponse("현재 비밀번호 불일치", { status: 400 });
    }
    return NextResponse.json({ ok: true });
}
