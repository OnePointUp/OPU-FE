import { NextResponse } from "next/server";
import { MEMBER, CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export async function GET() {
    // 현재 로그인된 유저 정보 찾기
    const member = MEMBER.find((m) => m.id === CURRENT_MEMBER_ID);

    if (!member) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await new Promise((r) => setTimeout(r, 400));

    return NextResponse.json({
        id: member.id,
        nickname: member.nickname,
        email: member.email,
        bio: member.bio,
        profileImageUrl: member.profileImage ?? "",
    });
}

export async function POST(req: Request) {
    const form = await req.formData();
    const nickname = String(form.get("nickname") ?? "");
    const bio = String(form.get("bio") ?? "");

    // TODO: DB 업데이트
    // 여기선 MEMBER 배열 내부 데이터 직접 업데이트
    const member = MEMBER.find((m) => m.id === CURRENT_MEMBER_ID);
    if (member) {
        member.nickname = nickname;
        member.bio = bio;
    }

    await new Promise((r) => setTimeout(r, 300));

    return NextResponse.json({
        ok: true,
        nickname,
        bio,
    });
}

export const PUT = POST;
