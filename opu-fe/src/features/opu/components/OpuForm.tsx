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
    onSubmit: (values: OpuFormValues) => void;
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
                <label className="block mb-2">제목</label>
                <div className="flex items-start gap-2">
                    <div className="flex-1">
                        <input
                            placeholder="OPU 제목을 입력해주세요"
                            className="input-box input-box--field w-full px-3"
                            value={title}
                            onChange={handleTitleChange}
                            disabled={disabled}
                        />
                        <div className="mt-1 text-right text-[12px] text-gray-400">
                            {titleLength}/{MAX_TITLE_LENGTH}
                        </div>
                    </div>

                    {/* 이모지 버튼 */}
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClickEmoji}
                        className="mt-[2px] px-2 py-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white text-2xl"
                    >
                        {currentEmoji || "😀"}
                        <Icon icon="mdi:chevron-down" width={20} height={20} />
                    </button>
                </div>

                {/* 설명 */}
                <label className="block mb-2 mt-6">설명</label>
                <textarea
                    placeholder="상세 설명을 입력해주세요"
                    className="input-box input-box--field w-full px-3 py-2 h-28 resize-none"
                    value={description}
                    onChange={handleDescriptionChange}
                    disabled={disabled}
                />
                <div className="mt-1 text-right text-[12px] text-gray-400">
                    {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                </div>

                {/* 시간 */}
                <label className="block mb-2 mt-6">시간</label>
                <button
                    type="button"
                    className="input-box input-box--field flex items-center justify-between"
                    onClick={onClickTime}
                    disabled={disabled}
                >
                    <span>{currentTimeLabel || "선택"}</span>
                    <Icon icon="mdi:chevron-right" width={20} height={20} />
                </button>

                {/* 카테고리 */}
                <label className="block mb-2 mt-6">카테고리</label>
                <button
                    type="button"
                    className="input-box input-box--field flex items-center justify-between"
                    onClick={onClickCategory}
                    disabled={disabled}
                >
                    <span>{currentCategoryLabel || "선택"}</span>
                    <Icon icon="mdi:chevron-right" width={20} height={20} />
                </button>

                {/* 공개 여부 */}
                <div className="flex items-center justify-between mt-6">
                    <label className="block mb-2">커뮤니티 공개 설정</label>
                    <Toggle
                        checked={isPublic}
                        onChange={handleToggleChange}
                        disabled={disabled}
                    />
                </div>

                {/* 제출 */}
                <div className="mt-10 mb-4">
                    <OpuActionButton
                        label={submitLabel}
                        disabled={isSubmitDisabled}
                        loading={submitting}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </form>
    );
}
