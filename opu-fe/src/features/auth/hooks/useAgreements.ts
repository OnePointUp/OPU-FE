"use client";

import { useState, useCallback } from "react";

export type AgreementsState = {
    all: boolean;
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
    notification: boolean;
};

const DEFAULT_AGREEMENTS: AgreementsState = {
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
    notification: false,
};

export function useAgreements(initial?: Partial<AgreementsState>) {
    const [agreements, setAgreements] = useState<AgreementsState>({
        ...DEFAULT_AGREEMENTS,
        ...initial,
    });

    const handleCheckAll = useCallback((checked: boolean) => {
        setAgreements({
            all: checked,
            terms: checked,
            privacy: checked,
            marketing: checked,
            notification: checked,
        });
    }, []);

    const handleCheckItem = useCallback(
        (key: keyof AgreementsState, checked: boolean) => {
            setAgreements((prev) => {
                const next: AgreementsState = { ...prev, [key]: checked };
                next.all =
                    next.terms &&
                    next.privacy &&
                    next.marketing &&
                    next.notification;
                return next;
            });
        },
        []
    );

    const agreedRequired = agreements.terms && agreements.privacy;

    return {
        agreements,
        agreedRequired,
        handleCheckAll,
        handleCheckItem,
        setAgreements,
    };
}
