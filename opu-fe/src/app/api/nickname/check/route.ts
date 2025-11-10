import { NextResponse } from "next/server";

const TAKEN = new Set(["김진영", "admin", "test"]);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const nickname = (searchParams.get("nickname") || "").trim();
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json({ exists: TAKEN.has(nickname) });
}
