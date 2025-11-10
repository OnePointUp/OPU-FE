import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { currentPassword, newPassword } = await req.json();
    await new Promise((r) => setTimeout(r, 300));
    if (!newPassword || newPassword.length < 8) {
        return new NextResponse("새 비밀번호 정책 위반", { status: 400 });
    }
    return NextResponse.json({ ok: true });
}
