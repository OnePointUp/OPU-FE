import { NextResponse } from "next/server";
import { notificationFeed } from "@/mocks/api/db/notification.db";

let feed = [...notificationFeed];

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);

    feed = feed.map((n) => (n.id === id ? { ...n, isRead: true } : n));

    return NextResponse.json(feed);
}
