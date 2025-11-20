"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Toggle from "@/components/common/Toggle";
import { Icon } from "@iconify/react";
import OpuActionButton from "@/components/common/OpuActionButton";
import { toastInfo } from "@/lib/toast";

type OpuFormValues = {
    title: string;
    emoji?: string;
    timeLabel?: string;
    categoryLabel?: string;
    isPublic: boolean;
};

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

const MAX_TITLE_LENGTH = 30;

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
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true);

    const currentEmoji = initialValues?.emoji ?? "";
    const currentTimeLabel = initialValues?.timeLabel ?? "";
    const currentCategoryLabel = initialValues?.categoryLabel ?? "";

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length > MAX_TITLE_LENGTH) {
            toastInfo("제목은 30글자까지만 입력할 수 있어요!");
            return;
        }

        setTitle(value);
    };

    const handleToggleChange = (v: boolean) => {
        setIsPublic(v);
    };

    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (disabled || submitting) return;

        onSubmit({
            title: title.trim(),
            emoji: currentEmoji,
            timeLabel: currentTimeLabel,
            categoryLabel: currentCategoryLabel,
            isPublic,
        });
    };

    const submitLabel = mode === "create" ? "등록" : "수정";

    const isSubmitDisabled =
        disabled || submitting || title.trim().length === 0;

    const titleLength = title.length;

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
                {/* 제목 */}
                <label
                    className="block mb-2"
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    제목
                </label>

                <div className="flex items-start gap-2">
                    {/* 인풋 + 글자수 */}
                    <div className="flex-1">
                        <input
                            placeholder="OPU 제목을 입력하세요"
                            className="input-box input-box--field w-full px-3"
                            value={title}
                            onChange={handleTitleChange}
                            disabled={disabled}
                        />
                        <div
                            className="mt-1 text-right"
                            style={{
                                fontSize: "12px",
                                color: "var(--color-light-gray)",
                            }}
                        >
                            {titleLength}/{MAX_TITLE_LENGTH}
                        </div>
                    </div>

                    {/* 이모지 버튼 */}
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClickEmoji}
                        className="mt-[2px] px-2 py-2 flex items-center justify-between rounded-xl border border-[var(--color-input-border)] bg-[--background] text-2xl"
                    >
                        {currentEmoji || "😀"}
                        <Icon
                            icon="mdi:chevron-down"
                            width={20}
                            height={20}
                            className="text-[var(--color-super-dark-gray)]"
                        />
                    </button>
                </div>

                {/* 시간 */}
                <label
                    className="block mb-2 mt-6"
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    시간
                </label>

                <button
                    type="button"
                    className="input-box input-box--field flex items-center justify-between"
                    onClick={onClickTime}
                    disabled={disabled}
                >
                    <span
                        className={
                            currentTimeLabel ? "text-black" : "text-placeholder"
                        }
                    >
                        {currentTimeLabel || "선택"}
                    </span>
                    <Icon
                        icon="mdi:chevron-right"
                        width={20}
                        height={20}
                        className="text-[var(--color-super-dark-gray)] mx-2"
                    />
                </button>

                {/* 카테고리 */}
                <label
                    className="block mb-2 mt-6"
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    카테고리
                </label>

                <button
                    type="button"
                    className="input-box input-box--field flex items-center justify-between"
                    onClick={onClickCategory}
                    disabled={disabled}
                >
                    <span
                        className={
                            currentCategoryLabel
                                ? "text-black"
                                : "text-placeholder"
                        }
                    >
                        {currentCategoryLabel || "선택"}
                    </span>
                    <Icon
                        icon="mdi:chevron-right"
                        width={20}
                        height={20}
                        className="text-[var(--color-super-dark-gray)] mx-2"
                    />
                </button>

                {/* 커뮤니티 공개 설정 */}
                <div className="flex items-center justify-between mt-6">
                    <label
                        className="block mb-2"
                        style={{
                            fontSize: "var(--text-sub)",
                            fontWeight: "var(--weight-semibold)",
                            color: "var(--color-dark-navy)",
                        }}
                    >
                        커뮤니티 공개 설정
                    </label>

                    <Toggle
                        checked={isPublic}
                        onChange={handleToggleChange}
                        disabled={disabled}
                    />
                </div>

                {/* 하단 버튼 */}
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
