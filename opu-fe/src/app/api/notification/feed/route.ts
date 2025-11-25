import { NextResponse } from "next/server";
import { notificationFeed } from "@/mocks/api/db/notification.db";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let feed = [...notificationFeed];

export async function GET() {
    await delay(120);
    return NextResponse.json(feed);
}

export async function PATCH(req: Request) {
    const body = await req.json().catch(() => ({} as { action?: string }));

    if (body.action === "ALL_READ") {
        feed = feed.map((n) => ({
            ...n,
            isRead: true,
        }));
    } else if (body.action === "ONE_READ" && typeof body.id === "number") {
        feed = feed.map((n) => (n.id === body.id ? { ...n, isRead: true } : n));
    }

    await delay(120);
    return NextResponse.json(feed);
}
