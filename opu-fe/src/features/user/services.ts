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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");

export async function fetchMyProfile(): Promise<UserProfile> {
    const url = API_BASE ? `${API_BASE}/me` : `/api/me`;
    return getJSON<UserProfile>(url);
}

// --- 닉네임 중복 검증 ---
export async function checkNicknameDup(
    nickname: string,
    currentNickname?: string
): Promise<boolean> {
    const q = encodeURIComponent(nickname.trim());
    const cur = encodeURIComponent(currentNickname?.trim() ?? "");
    const url = `/api/nickname/check?nickname=${q}&current=${cur}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.exists;
}

// --- 프로필 수정 ---
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
