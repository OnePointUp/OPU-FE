"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoutineForm from "../components/RoutineForm";
import type { RoutineFormValue } from "../types";
import { deleteRoutine, updateRoutine } from "../services";
import { toCreateRoutinePayload } from "../mappers";
import {
    RoutineFrequency,
    parseNumberList,
    buildFrequencyLabel,
    getFrequencyPartsFromRoutine,
} from "../domain";
import { useRoutine } from "../hooks/useRoutine";

type Props = { id: number };

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

export default function RoutineEditPage({ id }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [initialFormValue, setInitialFormValue] =
        useState<RoutineFormValue | null>(null);
    const [frequencyLabelOverride, setFrequencyLabelOverride] = useState<
        string | undefined
    >(undefined);
    const [submitting, setSubmitting] = useState(false);

    const STORAGE_KEY = `routine-form:edit:${id}`;

    const { routine, loading, error } = useRoutine(id);

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

        if (frequencyParam) {
            const days = parseNumberList(searchParams.get("days"));
            const months = parseNumberList(searchParams.get("months"));
            const last = searchParams.get("last") === "true";

            const storedForm = loadFormFromStorage(
                STORAGE_KEY,
                routineBaseForm
            );

            setInitialFormValue({
                ...storedForm,
                frequency: frequencyParam,
            });

            const freqLabel = buildFrequencyLabel(
                frequencyParam,
                days,
                months,
                last
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

    async function handleSubmit(form: RoutineFormValue) {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }

        setSubmitting(true);
        try {
            const basePayload = toCreateRoutinePayload(form);
            const payload = { ...basePayload, id };
            await updateRoutine(payload);
            router.push("/routine");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
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
    }

    if (!initialFormValue) return null;

    return (
        <RoutineForm
            mode="edit"
            initialValue={initialFormValue}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            submitting={submitting}
            frequencyLabelOverride={frequencyLabelOverride}
        />
    );
}
