"use client";

import { useEffect, useState } from "react";
import { fetchProfileSummary } from "@/features/member/services";

type MyPageMenuArgs = {
    onClickLogout: () => void;
};

type MyPageMenuItem =
    | { label: string; href: string; onClick?: never; disabled?: boolean }
    | { label: string; href?: never; onClick: () => void; disabled?: boolean };

export function useMyPageMenu({ onClickLogout }: MyPageMenuArgs) {
    const [authProvider, setAuthProvider] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const profile = await fetchProfileSummary();
                if (cancelled) return;
                setAuthProvider(profile.authProvider);
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setAuthProvider(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const isLocal = authProvider === "local";

    const items: MyPageMenuItem[] = [
        { label: "차단 OPU 관리", href: "/opu/blocked" },
        { label: "알림 설정", href: "/notification/setting" },
    ];

    if (isLocal) {
        items.push({
            label: "비밀번호 변경",
            href: "/me/verify-password",
        });
    }

    items.push({
        label: "로그아웃",
        onClick: onClickLogout,
    });

    return { myPageMenuItems: items, menuLoading: loading };
}
