"use client";

import { useState, useCallback } from "react";
import { Agreements } from "../types";

const DEFAULT_AGREEMENTS: Agreements = {
    all: false,
    age14: false,
    terms: false,
    privacy: false,
    webPush: false,
};

export function useAgreements(initial?: Partial<Agreements>) {
    const [agreements, setAgreements] = useState<Agreements>({
        ...DEFAULT_AGREEMENTS,
        ...initial,
    });

    const handleCheckAll = useCallback((checked: boolean) => {
        setAgreements({
            all: checked,
            age14: checked,
            terms: checked,
            privacy: checked,
            webPush: checked,
        });
    }, []);

    const handleCheckItem = useCallback(
        (key: keyof Agreements, checked: boolean) => {
            setAgreements((prev) => {
                const next: Agreements = { ...prev, [key]: checked };
                next.all =
                    next.age14 && next.terms && next.privacy && next.webPush;
                return next;
            });
        },
        []
    );

    const agreedRequired =
        agreements.age14 && agreements.terms && agreements.privacy;

    return {
        agreements,
        agreedRequired,
        handleCheckAll,
        handleCheckItem,
        setAgreements,
    };
}
