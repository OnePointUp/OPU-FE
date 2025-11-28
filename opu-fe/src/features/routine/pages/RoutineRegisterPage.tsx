"use client";

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

    const initialValue: RoutineFormValue = {
        ...DEFAULT_FORM,
        frequency: freq,
    };

    const frequencyLabelOverride = buildFrequencyLabel(
        freq,
        days,
        months,
        last
    );

    async function handleSubmit(form: RoutineFormValue) {
        const payload = toCreateRoutinePayload(form);
        await createRoutine(payload);
        router.push("/routine");
    }

    return (
        <RoutineForm
            mode="create"
            initialValue={initialValue}
            onSubmit={handleSubmit}
            frequencyLabelOverride={frequencyLabelOverride}
        />
    );
}
