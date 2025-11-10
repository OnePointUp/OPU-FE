import { NextResponse } from "next/server";

const TAKEN = new Set(["윤채영", "admin", "test"]);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const nickname = (searchParams.get("nickname") || "").trim();
    const current = (searchParams.get("current") || "").trim();

    await new Promise((r) => setTimeout(r, 200));

    const exists = nickname !== current && TAKEN.has(nickname); // 본인 닉네임 제외

    return NextResponse.json({ exists });
}
