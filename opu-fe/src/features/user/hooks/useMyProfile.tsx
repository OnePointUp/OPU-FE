"use client";

import { useEffect, useState } from "react";
import { fetchMyProfile, type UserProfile } from "@/features/user/services";

export function useMyProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyProfile()
            .then(setProfile)
            .catch((err) => console.error("프로필 불러오기 실패: ", err))
            .finally(() => setLoading(false));
    }, []);

    return { profile, loading };
}
