// RoutineEditPage.tsx

"use client";

import { useState } from "react";
import RoutineForm from "../components/RoutineForm";
import type { RoutineFormValue } from "../types";
import { useRoutineEditPage } from "../hooks/useRoutineEditPage";
import BottomSheet from "@/components/common/BottomSheet";

type Props = { id: number };

export default function RoutineEditPage({ id }: Props) {
    const {
        initialFormValue,
        frequencyLabelOverride,
        submitting,
        handleSubmit,
        handleDelete,
        // TODO: 미완료만 삭제 핸들러 생기면 여기서도 꺼내쓰기
        // handleDeleteIncomplete,
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
        // TODO: 미완료만 삭제 API 연결
        // await handleDeleteIncomplete();
        closeDeleteSheet();
    };

    return (
        <>
            <RoutineForm
                key={initialFormValue.id}
                mode="edit"
                initialValue={initialFormValue as RoutineFormValue}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                // 🔥 삭제 버튼 → 바텀시트 오픈
                onDeleteClick={openDeleteSheet}
                submitting={submitting}
                frequencyLabelOverride={frequencyLabelOverride}
            />

            {/* 삭제 옵션 바텀시트 */}
            <BottomSheet
                open={deleteSheetOpen}
                onClose={closeDeleteSheet}
                showHandle
            >
                <div className="flex flex-col gap-2 py-2">
                    <button
                        type="button"
                        onClick={handleDeleteAllClick}
                        className="w-full h-11 rounded-[12px] bg-[#FF4A4A] text-white text-[14px] font-medium"
                    >
                        전체 삭제
                    </button>

                    <button
                        type="button"
                        onClick={handleDeleteIncompleteClick}
                        className="w-full h-11 rounded-[12px] bg-[var(--color-super-light-gray)] text-[14px] font-medium text-[var(--color-dark-navy)]"
                    >
                        미완료만 삭제
                    </button>

                    <button
                        type="button"
                        onClick={closeDeleteSheet}
                        className="w-full h-11 rounded-[12px] bg-white text-[13px] text-[var(--color-dark-gray)]"
                    >
                        취소
                    </button>
                </div>
            </BottomSheet>
        </>
    );
}
