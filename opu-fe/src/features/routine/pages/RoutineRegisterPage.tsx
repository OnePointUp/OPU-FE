"use client";

import RoutineForm from "../components/RoutineForm";
import { useRoutineRegisterPage } from "../hooks/useRoutineRegisterPage";

export default function RoutineRegisterPage() {
    const { initialFormValue, frequencyLabelOverride, handleSubmit } =
        useRoutineRegisterPage();

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
