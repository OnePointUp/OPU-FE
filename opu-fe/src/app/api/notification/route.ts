import { NextResponse } from "next/server";

let MOCK = {
    allEnabled: true,
    morning: true,
    evening: true,
    routine: true,
    todayTodo: true,
    reminder1: true,
    reminder2: true,
};

export async function GET() {
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json(MOCK);
}

export async function PUT(req: Request) {
    const body = await req.json();
    MOCK = { ...MOCK, ...body };
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json({ ok: true });
}
