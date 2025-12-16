"use client";

import { Icon } from "@iconify/react";
import Toggle from "@/components/common/Toggle";
import OpuActionButton from "@/components/common/OpuActionButton";
import type { OpuFormValues } from "../domain";
import {
    useOpuForm,
    MAX_TITLE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
} from "../hooks/useOpuForm";

type Props = {
    mode: "create" | "edit";
    initialValues?: Partial<OpuFormValues>;
    onSubmit: (values: OpuFormValues) => Promise<void> | void;
    onClickTime?: () => void;
    onClickCategory?: () => void;
    onClickEmoji?: () => void;
    submitting?: boolean;
    disabled?: boolean;
};

export default function OpuForm({
    mode,
    initialValues,
    onSubmit,
    onClickTime,
    onClickCategory,
    onClickEmoji,
    submitting = false,
    disabled = false,
}: Props) {
    const currentEmoji = initialValues?.emoji ?? "";
    const currentTimeLabel = initialValues?.timeLabel ?? "";
    const currentCategoryLabel = initialValues?.categoryLabel ?? "";

    const {
        title,
        description,
        isPublic,
        submitLabel,
        isSubmitDisabled,
        titleLength,
        descriptionLength,
        localSubmitting,
        handleTitleChange,
        handleDescriptionChange,
        handleToggleChange,
        handleSubmit,
    } = useOpuForm({
        mode,
        initialValues,
        onSubmit,
        submitting,
        disabled,
        currentEmoji,
        currentTimeLabel,
        currentCategoryLabel,
    });

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
                {/* 제목 */}
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <input
                            value={title}
                            onChange={handleTitleChange}
                            disabled={disabled}
                            placeholder="OPU 제목을 입력해주세요."
                            className="input-box input-box--field"
                        />
                        <div className="length-validation mt-1 text-right">
                            {titleLength}/{MAX_TITLE_LENGTH}
                        </div>
                    </div>

                    {/* 이모지 버튼 */}
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClickEmoji}
                        className="px-2 py-2 flex items-center justify-between rounded-[12px] border border-[var(--color-input-border)] bg-white text-2xl"
                    >
                        {currentEmoji || "😀"}
                        <Icon icon="mdi:chevron-down" width={20} height={20} />
                    </button>
                </div>

                {/* 설명 */}
                <div className="flex flex-col">
                    <input
                        placeholder="상세 설명을 입력해주세요."
                        className="input-box input-box--field"
                        value={description}
                        onChange={handleDescriptionChange}
                        disabled={disabled}
                    />
                    <div className="length-validation mt-1 text-right">
                        {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                    </div>
                </div>

                <div className="flex flex-col gap-4 py-6">
                    {/* 소요시간 */}
                    <div className="w-full relative">
                        <button
                            type="button"
                            onClick={onClickTime}
                            disabled={disabled}
                            className="input-box-2 input-box--field flex items-center justify-between overflow-hidden pr-2"
                        >
                            <span
                                style={{
                                    fontSize: "var(--text-sub)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                소요시간
                            </span>
                            <span className="form-label flex items-center gap-1">
                                <span>{currentTimeLabel || "선택"}</span>
                                <Icon
                                    icon="mdi:chevron-right"
                                    width={20}
                                    height={20}
                                    className="text-[var(--color-super-dark-gray)]"
                                />
                            </span>
                        </button>
                    </div>

                    {/* 카테고리 */}
                    <div className="w-full relative mb-1">
                        <button
                            type="button"
                            onClick={onClickCategory}
                            disabled={disabled}
                            className="input-box-2 input-box--field flex items-center justify-between overflow-hidden pr-2"
                        >
                            <span
                                style={{
                                    fontSize: "var(--text-sub)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                카테고리
                            </span>
                            <span className="form-label flex items-center gap-1">
                                <span>{currentCategoryLabel || "선택"}</span>
                                <Icon
                                    icon="mdi:chevron-right"
                                    width={20}
                                    height={20}
                                    className="text-[var(--color-super-dark-gray)]"
                                />
                            </span>
                        </button>
                    </div>

                    {/* 공개 여부 */}
                    <div className="flex pl-3 items-center justify-between">
                        <label className="form-label block">
                            커뮤니티 공개 설정
                        </label>
                        <Toggle
                            checked={isPublic}
                            onChange={handleToggleChange}
                            disabled={disabled}
                        />
                    </div>
                </div>

                {/* 제출 */}
                <div className="mt-10 mb-4">
                    <OpuActionButton
                        label={submitLabel}
                        disabled={isSubmitDisabled}
                        loading={submitting || localSubmitting}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </form>
    );
}
