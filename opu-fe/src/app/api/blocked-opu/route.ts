import { NextResponse } from "next/server";
import { listBlockedOpu } from "@/mocks/api/handler/blockedOpu";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const sp = new URL(req.url).searchParams;
    const memberId = Number(sp.get("memberId") ?? "0");
    const q = (sp.get("q") ?? "").trim();

    const items = listBlockedOpu(memberId, q);
    return NextResponse.json({ items, total: items.length });
}
