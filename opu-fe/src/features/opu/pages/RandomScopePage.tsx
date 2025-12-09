"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RandomScopeStep, {
    ScopeValue,
} from "@/features/opu/components/RandomScopeStep";
import { fetchProfileSummary } from "@/features/member/services";

export default function RandomScopePage() {
    const router = useRouter();
    const [scope, setScope] = useState<ScopeValue>(null);

    const [likedCount, setLikedCount] = useState<number>(0);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const summary = await fetchProfileSummary();
                if (!mounted) return;
                setLikedCount(summary.favoriteOpuCount);
            } catch {
                if (!mounted) return;
                setLikedCount(0);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

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
