"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toastInfo } from "@/lib/toast";
import type { OpuFormValues } from "../domain";

export const MAX_TITLE_LENGTH = 30;
export const MAX_DESCRIPTION_LENGTH = 100;

type Params = {
    mode: "create" | "edit";
    initialValues?: Partial<OpuFormValues>;
    onSubmit: (values: OpuFormValues) => void;
    submitting?: boolean;
    disabled?: boolean;
    currentEmoji: string;
    currentTimeLabel: string;
    currentCategoryLabel: string;
};

export function useOpuForm({
    mode,
    initialValues,
    onSubmit,
    submitting = false,
    disabled = false,
    currentEmoji,
    currentTimeLabel,
    currentCategoryLabel,
}: Params) {
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(
        initialValues?.description ?? ""
    );
    const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true);

    /** 제목 */
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length > MAX_TITLE_LENGTH) {
            toastInfo("제목은 30글자까지만 입력할 수 있어요!");
            return;
        }
        setTitle(value);
    };

    /** 설명 */
    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length > MAX_DESCRIPTION_LENGTH) {
            toastInfo("설명은 100글자까지만 입력할 수 있어요!");
            return;
        }
        setDescription(value);
    };

    /** 공개 여부 */
    const handleToggleChange = (v: boolean) => setIsPublic(v);

    /** 제출 */
    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (disabled || submitting) return;

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            emoji: currentEmoji,
            timeLabel: currentTimeLabel,
            categoryLabel: currentCategoryLabel,
            isPublic,
        });
    };

    const submitLabel = mode === "create" ? "등록" : "수정";
    const isSubmitDisabled =
        disabled || submitting || title.trim().length === 0;

    return {
        title,
        description,
        isPublic,
        submitLabel,
        isSubmitDisabled,
        titleLength: title.length,
        descriptionLength: description.length,
        handleTitleChange,
        handleDescriptionChange,
        handleToggleChange,
        handleSubmit,
    };
}
