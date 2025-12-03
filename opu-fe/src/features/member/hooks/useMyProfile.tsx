"use client";

import { useEffect, useState } from "react";
import { fetchProfileSummary } from "../services";
import { MemberProfileSummary } from "../types";

export function useMyProfile() {
    const [profile, setProfile] = useState<MemberProfileSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileSummary()
            .then(setProfile)
            .catch((err) => console.error("프로필 불러오기 실패: ", err))
            .finally(() => setLoading(false));
    }, []);

    return { profile, loading };
}
