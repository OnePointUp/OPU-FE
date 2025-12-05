// useRoutineRegisterPage.ts

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { RoutineFormValue } from "../types";
import { createRoutine } from "../services";
import { toCreateRoutinePayload } from "../mappers";
import {
    type RoutineFrequency,
    parseNumberList,
    buildFrequencyLabel,
} from "../domain";

const DEFAULT_FORM: RoutineFormValue = {
    title: "",
    frequency: "DAILY",
    startDate: null,
    endDate: null,
    alarmTime: null,
    color: "#FFFAA2",
};

const STORAGE_KEY = "routine-form:create";

function loadFormFromStorage(defaultFreq: RoutineFrequency): RoutineFormValue {
    if (typeof window === "undefined") {
        return { ...DEFAULT_FORM, frequency: defaultFreq };
    }

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...DEFAULT_FORM, frequency: defaultFreq };
        }

        const parsed = JSON.parse(raw) as Partial<RoutineFormValue>;

        const titleToUse =
            parsed.title === "" || parsed.title === undefined
                ? DEFAULT_FORM.title
                : parsed.title;

        const parsedFreq = parsed.frequency as RoutineFrequency | undefined;
        const freqToUse = parsedFreq ?? defaultFreq;

        return {
            ...DEFAULT_FORM,
            ...parsed,
            title: titleToUse,
            frequency: freqToUse,
        };
    } catch {
        return { ...DEFAULT_FORM, frequency: defaultFreq };
    }
}

export function useRoutineRegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const frequencyParam = searchParams.get(
        "frequency"
    ) as RoutineFrequency | null;
    const freq: RoutineFrequency = frequencyParam ?? "DAILY";

    const titleParam = searchParams.get("title") ?? "";
    const daysParam = searchParams.get("days"); // "1,10,31"
    const monthsParam = searchParams.get("months"); // "1,2"
    const lastParam = searchParams.get("last") === "true";

    const days = parseNumberList(daysParam);
    const months = parseNumberList(monthsParam);
    const last = lastParam;

    const frequencyLabelOverride = useMemo(
        () => buildFrequencyLabel(freq, days, months, last),
        [freq, days, months, last]
    );

    const [initialFormValue, setInitialFormValue] =
        useState<RoutineFormValue | null>(null);

    useEffect(() => {
        let restored = loadFormFromStorage(freq);

        // 반복 페이지에서 MONTHLY 선택하고 돌아온 경우
        if (frequencyParam === "MONTHLY") {
            const tokens: string[] = [];

            if (daysParam) {
                tokens.push(
                    ...daysParam
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                );
            }

            if (lastParam) {
                tokens.push("L");
            }

            restored = {
                ...restored,
                frequency: "MONTHLY",
                monthDays: tokens.length > 0 ? tokens.join(",") : null,
            };
        }

        // 반복 페이지에서 YEARLY 선택하고 돌아온 경우
        if (frequencyParam === "YEARLY") {
            const monthsArr = parseNumberList(monthsParam);
            const daysArr = parseNumberList(daysParam);

            const tokens: string[] = [];

            const len = Math.min(monthsArr.length, daysArr.length);
            for (let i = 0; i < len; i += 1) {
                tokens.push(`${monthsArr[i]}-${daysArr[i]}`);
            }

            if (lastParam) {
                tokens.push("L");
            }

            restored = {
                ...restored,
                frequency: "YEARLY",
                yearDays: tokens.length > 0 ? tokens.join(",") : null,
            };
        }

        if (titleParam) {
            restored = {
                ...restored,
                title: titleParam,
            };
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInitialFormValue(restored);

        // 무한루프 방지
        // if (frequencyParam) {
        //   router.replace("/routine/register", { scroll: false });
        // }
    }, [freq, titleParam, frequencyParam, daysParam, monthsParam, lastParam]);

    const handleSubmit = useCallback(
        async (form: RoutineFormValue) => {
            if (typeof window !== "undefined") {
                window.sessionStorage.removeItem(STORAGE_KEY);
            }

            const payload = toCreateRoutinePayload(form);
            await createRoutine(payload);
            router.push("/routine");
        },
        [router]
    );

    return {
        initialFormValue,
        frequencyLabelOverride,
        handleSubmit,
    };
}
