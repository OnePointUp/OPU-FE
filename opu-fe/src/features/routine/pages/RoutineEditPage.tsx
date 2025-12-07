"use client";

import { useState } from "react";
import RoutineForm from "../components/RoutineForm";
import type { RoutineFormValue } from "../types";
import { useRoutineEditPage } from "../hooks/useRoutineEditPage";
import BottomSheet from "@/components/common/BottomSheet";
import ActionList, { type ActionItem } from "@/components/common/ActionList";

type Props = { id: number };

export default function RoutineEditPage({ id }: Props) {
    const {
        initialFormValue,
        frequencyLabelOverride,
        submitting,
        handleSubmit,
        handleDelete,
        handleDeleteIncomplete,
    } = useRoutineEditPage(id);

    const [deleteSheetOpen, setDeleteSheetOpen] = useState(false);

    if (!initialFormValue) return null;

    const openDeleteSheet = () => setDeleteSheetOpen(true);
    const closeDeleteSheet = () => setDeleteSheetOpen(false);

    const handleDeleteAllClick = async () => {
        await handleDelete();
        closeDeleteSheet();
    };

    const handleDeleteIncompleteClick = async () => {
        await handleDeleteIncomplete();
        closeDeleteSheet();
    };

    const actionItems: ActionItem[] = [
        {
            label: "전체 삭제",
            danger: true,
            onClick: handleDeleteAllClick,
        },
        {
            label: "미완료만 삭제",
            onClick: handleDeleteIncompleteClick,
        },
        {
            label: "취소",
            onClick: closeDeleteSheet,
        },
    ];

    return (
        <>
            <RoutineForm
                key={initialFormValue.id}
                mode="edit"
                initialValue={initialFormValue as RoutineFormValue}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                onDeleteClick={openDeleteSheet}
                submitting={submitting}
                frequencyLabelOverride={frequencyLabelOverride}
            />

            <BottomSheet
                open={deleteSheetOpen}
                onClose={closeDeleteSheet}
                showHandle
            >
                <ActionList items={actionItems} />
            </BottomSheet>
        </>
    );
}
