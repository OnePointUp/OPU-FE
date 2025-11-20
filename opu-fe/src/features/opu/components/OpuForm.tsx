"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Toggle from "@/components/common/Toggle";
import { Icon } from "@iconify/react";
import OpuActionButton from "@/components/common/OpuActionButton";

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
    // 폼 내부에서만 관리할 애들
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? true);

    // 부모에서 내려오는 현재 선택 상태
    const currentEmoji = initialValues?.emoji ?? "";
    const currentTimeLabel = initialValues?.timeLabel ?? "";
    const currentCategoryLabel = initialValues?.categoryLabel ?? "";

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
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

    const submitLabel = mode === "create" ? "등록" : "수정 완료";

    const isSubmitDisabled =
        disabled || submitting || title.trim().length === 0;

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col mx-2">
                {/* 제목 */}
                <label
                    className="block mb-2 mt-6"
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-semibold)",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    제목
                </label>

                <div className="flex items-center gap-2">
                    <input
                        placeholder="OPU 제목을 입력하세요"
                        className="input-box input-box--field flex-1 px-3"
                        value={title}
                        onChange={handleTitleChange}
                        disabled={disabled}
                    />

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClickEmoji}
                        className="px-2 py-2 flex items-center justify-between rounded-xl border border-[var(--color-input-border)] bg-[--background] text-2xl"
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
