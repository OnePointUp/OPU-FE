"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { RoutineFormValue } from "../types";
import { deleteRoutine, editRoutine } from "../services";
import {
    type RoutineFrequency,
    parseNumberList,
    buildFrequencyLabel,
    getFrequencyPartsFromRoutine,
} from "../domain";
import { useRoutineDetail } from "./useRoutineDetail";
import { toEditRoutinePayload } from "../mappers";

function loadFormFromStorage(
    storageKey: string,
    fallback: RoutineFormValue
): RoutineFormValue {
    if (typeof window === "undefined") return fallback;

    try {
        const raw = window.sessionStorage.getItem(storageKey);
        if (!raw) return fallback;

        const parsed = JSON.parse(raw) as Partial<RoutineFormValue>;
        return {
            ...fallback,
            ...parsed,
        };
    } catch {
        return fallback;
    }
}

export function useRoutineEditPage(id: number) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [initialFormValue, setInitialFormValue] =
        useState<RoutineFormValue | null>(null);
    const [frequencyLabelOverride, setFrequencyLabelOverride] = useState<
        string | undefined
    >(undefined);
    const [submitting, setSubmitting] = useState(false);

    const STORAGE_KEY = useMemo(() => `routine-form:edit:${id}`, [id]);

    const { routine, loading, error } = useRoutineDetail(id);

    useEffect(() => {
        if (!loading && error) {
            console.error("Failed to fetch routine:", error);
            router.push("/routine");
        }
    }, [loading, error, router]);

    useEffect(() => {
        if (!routine) return;

        const routineBaseForm: RoutineFormValue = {
            id,
            title: routine.title,
            startDate: routine.startDate,
            endDate: routine.endDate,
            frequency: routine.frequency,
            weekDays: routine.weekDays ?? null,
            monthDays: routine.monthDays ?? null,
            yearDays: routine.yearDays ?? null,
            color: routine.color,
            alarmTime: routine.alarmTime,
        };

        const frequencyParam = searchParams.get(
            "frequency"
        ) as RoutineFrequency | null;

        const daysParam = searchParams.get("days");
        const monthsParam = searchParams.get("months");
        const lastParam = searchParams.get("last") === "true";

        if (frequencyParam) {
            const days = parseNumberList(daysParam);
            const months = parseNumberList(monthsParam);
            const last = lastParam;

            let storedForm = loadFormFromStorage(STORAGE_KEY, routineBaseForm);

            if (frequencyParam === "WEEKLY" || frequencyParam === "BIWEEKLY") {
                const weekIdx = days.map((d) => d - 1); // 1~7 → 0~6
                storedForm = {
                    ...storedForm,
                    frequency: frequencyParam,
                    weekDays: weekIdx.length > 0 ? weekIdx.join(",") : null,
                    monthDays: null,
                    yearDays: null,
                };
            }

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

                storedForm = {
                    ...storedForm,
                    frequency: "MONTHLY",
                    monthDays: tokens.length > 0 ? tokens.join(",") : null,
                    weekDays: null,
                    yearDays: null,
                };
            }

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

                storedForm = {
                    ...storedForm,
                    frequency: "YEARLY",
                    yearDays: tokens.length > 0 ? tokens.join(",") : null,
                    weekDays: null,
                    monthDays: null,
                };
            }

            setInitialFormValue(storedForm);

            const freqLabel = buildFrequencyLabel(
                frequencyParam,
                parseNumberList(daysParam),
                parseNumberList(monthsParam),
                lastParam
            );
            setFrequencyLabelOverride(freqLabel);

            router.replace(`/routine/edit/${id}`, { scroll: false });
            return;
        }

        setInitialFormValue((prev) => prev ?? routineBaseForm);

        setFrequencyLabelOverride((prev) => {
            if (prev) return prev;

            const { days, months, last } =
                getFrequencyPartsFromRoutine(routine);
            return buildFrequencyLabel(routine.frequency, days, months, last);
        });
    }, [routine, id, searchParams, STORAGE_KEY, router]);

    const handleSubmit = useCallback(
        async (form: RoutineFormValue) => {
            if (typeof window !== "undefined") {
                window.sessionStorage.removeItem(STORAGE_KEY);
            }

            setSubmitting(true);
            try {
                // TODO: scope는 나중에 UI에서 선택하게 만들면 거기서 값 받아오기
                const scope = "ALL";

                const payload = toEditRoutinePayload(form, scope);
                await editRoutine(id, payload);
                router.push("/routine");
            } finally {
                setSubmitting(false);
            }
        },
        [STORAGE_KEY, id, router]
    );

    const handleDelete = useCallback(async () => {
        setSubmitting(true);
        try {
            await deleteRoutine(id);
            if (typeof window !== "undefined") {
                window.sessionStorage.removeItem(STORAGE_KEY);
            }
            router.push("/routine");
        } finally {
            setSubmitting(false);
        }
    }, [STORAGE_KEY, id, router]);

    return {
        initialFormValue,
        frequencyLabelOverride,
        submitting,
        handleSubmit,
        handleDelete,
    };
}
