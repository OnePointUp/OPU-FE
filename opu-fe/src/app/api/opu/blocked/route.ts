import { NextResponse } from "next/server";
import { listBlockedOpu } from "@/mocks/api/handler/blockedOpu";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const sp = new URL(req.url).searchParams;
    const q = sp.get("q") ?? "";
    const items = listBlockedOpu(q);
    return NextResponse.json(items);
}
