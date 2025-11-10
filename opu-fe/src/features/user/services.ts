export type UserProfile = {
    nickname: string;
    email: string;
    bio?: string;
    profileImageUrl?: string;
};

// 공통 fetch 헬퍼 (토큰/에러처리 확장 가능)
async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Request failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

// API 베이스 (운영 전환 시 .env에 NEXT_PUBLIC_API_BASE만 세팅)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");

export async function fetchMyProfile(): Promise<UserProfile> {
    const url = API_BASE ? `${API_BASE}/me` : `/api/me`;
    return getJSON<UserProfile>(url);
}

type NickCheckRes = { exists: boolean };
export async function checkNicknameDup(nickname: string): Promise<boolean> {
    const q = encodeURIComponent(nickname.trim());
    const url = API_BASE
        ? `${API_BASE}/users/nickname/check?nickname=${q}`
        : `/api/nickname/check?nickname=${q}`;
    const data = await getJSON<NickCheckRes>(url);
    return data.exists;
}

export async function saveProfile(payload: {
    nickname: string;
    bio: string;
    profileFile?: File | null;
}) {
    const url = API_BASE ? `${API_BASE}/me` : `/api/me`;

    const fd = new FormData();
    fd.append("nickname", payload.nickname);
    fd.append("bio", payload.bio);
    if (payload.profileFile) fd.append("profileImage", payload.profileFile);

    const res = await fetch(url, {
        method: API_BASE ? "PUT" : "POST",
        body: fd,
    });

    if (!res.ok) throw new Error("Save failed");
    return { ok: true };
}
