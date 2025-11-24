"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RandomScopeStep, {
    ScopeValue,
} from "@/features/opu/components/RandomScopeStep";
import { getLikedCountByMember } from "../random";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default function RandomScopePage() {
    const router = useRouter();
    const [scope, setScope] = useState<ScopeValue>(null);

    const likedCount = getLikedCountByMember(CURRENT_MEMBER_ID);
    const canUseLiked = likedCount > 0;

    return (
        <RandomScopeStep
            value={scope}
            onChange={setScope}
            onNext={() => {
                if (!scope) return;
                router.push(`/opu/random/time?scope=${scope}`);
            }}
            canUseLiked={canUseLiked}
            likedCount={likedCount}
        />
    );
}
