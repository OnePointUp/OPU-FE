"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoutineForm from "../components/RoutineForm";
import type { RoutineFormValue } from "../types";
import { createRoutine } from "../services";
import { toCreateRoutinePayload } from "../mappers";
import {
    RoutineFrequency,
    parseNumberList,
    buildFrequencyLabel,
} from "../domain";

const DEFAULT_FORM: RoutineFormValue = {
    title: "",
    frequency: "DAILY",
    startDate: null,
    endDate: null,
    time: null,
    color: "#FFFAA2",
};

const STORAGE_KEY = "routine-form:create";

function loadFormFromStorage(freq: RoutineFrequency): RoutineFormValue {
    if (typeof window === "undefined") {
        return { ...DEFAULT_FORM, frequency: freq };
    }

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...DEFAULT_FORM, frequency: freq };
        }

        const parsed = JSON.parse(raw) as Partial<RoutineFormValue>;

        const titleToUse =
            parsed.title === "" || parsed.title === undefined
                ? DEFAULT_FORM.title
                : parsed.title;

        return {
            ...DEFAULT_FORM,
            ...parsed,
            title: titleToUse,
            frequency: freq,
        };
    } catch {
        return { ...DEFAULT_FORM, frequency: freq };
    }
}

export default function RoutineRegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const frequencyParam = searchParams.get(
        "frequency"
    ) as RoutineFrequency | null;
    const freq: RoutineFrequency = frequencyParam ?? "DAILY";

    const days = parseNumberList(searchParams.get("days"));
    const months = parseNumberList(searchParams.get("months"));
    const last = searchParams.get("last") === "true";

    const frequencyLabelOverride = buildFrequencyLabel(
        freq,
        days,
        months,
        last
    );

    const [initialFormValue, setInitialFormValue] =
        useState<RoutineFormValue | null>(null);

    useEffect(() => {
        const restored = loadFormFromStorage(freq);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInitialFormValue(restored);

        if (searchParams.toString().includes("frequency")) {
            router.replace(`/routine/register`, { scroll: false });
        }
    }, [freq, router, searchParams]);

    async function handleSubmit(form: RoutineFormValue) {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }

        const payload = toCreateRoutinePayload(form);
        await createRoutine(payload);
        router.push("/routine");
    }

    if (!initialFormValue) {
        return null;
    }

    return (
        <RoutineForm
            mode="create"
            initialValue={initialFormValue}
            onSubmit={handleSubmit}
            frequencyLabelOverride={frequencyLabelOverride}
        />
    );
}
