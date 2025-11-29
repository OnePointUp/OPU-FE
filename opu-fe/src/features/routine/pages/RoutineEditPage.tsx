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
    getFrequencyPartsFromRoutine, // 🔥 domain.ts에 추가한 헬퍼
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
            frequency: routine.frequency,
            startDate: routine.startDate,
            endDate: routine.endDate,
            time: routine.time,
            color: routine.color,

            weekDays: routine.weekDays ?? null,
            monthDays: routine.monthDays ?? null,
            yearDays: routine.yearDays ?? null,
        };

        const frequencyParam = searchParams.get(
            "frequency"
        ) as RoutineFrequency | null;

        // 1) 반복선택 페이지에서 돌아온 경우 (쿼리 있음)
        if (frequencyParam) {
            const days = parseNumberList(searchParams.get("days"));
            const months = parseNumberList(searchParams.get("months"));
            const last = searchParams.get("last") === "true";

            const storedForm = loadFormFromStorage(
                STORAGE_KEY,
                routineBaseForm
            );

            // 🔥 지금 작성중이던 값 + 새 frequency 반영
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

            // 쿼리 제거 (두 번째 렌더) → 아래의 "쿼리 없음" 로직이 덮어쓰지 않도록 주의
            router.replace(`/routine/edit/${id}`, { scroll: false });
            return;
        }

        // 2) 쿼리 없는 상태 (초기 진입 또는 replace 이후 두 번째 렌더)
        //    이미 initialFormValue가 세팅되어 있으면 건드리지 않음
        setInitialFormValue((prev) => prev ?? routineBaseForm);

        // 라벨도 한 번만 세팅 (이미 override 있으면 유지)
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
