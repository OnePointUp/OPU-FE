export type UserProfile = {
    nickname: string;
    email: string;
    introduction?: string;
    profileImageUrl?: string;
};

export async function fetchMyProfile(): Promise<UserProfile> {
    const res = await fetch("/api/me", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
}
