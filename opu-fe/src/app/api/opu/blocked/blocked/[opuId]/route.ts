import { NextResponse } from "next/server";
import { unblock } from "@/mocks/api/handler/blockedOpu";

export async function DELETE(
    req: Request,
    { params }: { params: { opuId: string } }
) {
    const opuId = Number(params.opuId);
    unblock(opuId);
    return NextResponse.json({ ok: true });
}
