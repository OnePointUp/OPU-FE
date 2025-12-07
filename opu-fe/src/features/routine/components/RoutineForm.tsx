"use client";

import { useEffect, useState } from "react";
import type React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { formatDate } from "@/utils/formatDate";
import { getFrequencyLabel } from "@/features/routine/domain";
import type { RoutineFormValue } from "../types";
import { ROUTINE_COLOR_OPTIONS } from "../constants";
import OpuActionButton from "@/components/common/OpuActionButton";
import { Icon } from "@iconify/react";
import InlineCalendar from "./InlineCalendar";
import { useRouter } from "next/navigation";
import BottomSheet from "@/components/common/BottomSheet";
import TimePickerSheet from "./TimePickerSheet";
import { toastWarn } from "@/lib/toast";

type Props = {
    mode: "create" | "edit";
    initialValue: RoutineFormValue;
    onSubmit: (form: RoutineFormValue) => Promise<void> | void;
    onDelete?: () => Promise<void> | void;
    onDeleteClick?: () => void;
    submitting?: boolean;
    disabled?: boolean;
    frequencyLabelOverride?: string;
};

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function formatDateOrNone(date: string | null) {
    if (!date) return "없음";
    return formatDate(date);
}

function formatTimeOrNone(alarmTime: string | null) {
    if (!alarmTime) return "없음";

    if (alarmTime.includes("오전") || alarmTime.includes("오후")) {
        return alarmTime;
    }

    if (alarmTime.includes(":")) {
        const [h, m] = alarmTime.split(":").map(Number);
        if (isNaN(h) || isNaN(m)) return alarmTime;

        const ampm = h >= 12 ? "오후" : "오전";
        const h12 = h % 12 || 12;

        return `${ampm} ${h12}:${pad2(m)}`;
    }

    return alarmTime;
}

export default function RoutineForm({
    mode,
    initialValue,
    onSubmit,
    onDelete,
    onDeleteClick,
    submitting = false,
    disabled = false,
    frequencyLabelOverride,
}: Props) {
    const router = useRouter();
    const isClient = typeof window !== "undefined";

    const STORAGE_KEY =
        mode === "create"
            ? "routine-form:create"
            : `routine-form:edit:${initialValue.id}`;

    const [form, setForm] = useState<RoutineFormValue>(initialValue);

    useEffect(() => {
        setForm(initialValue);
    }, [initialValue]);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [activeDateField, setActiveDateField] = useState<
        "startDate" | "endDate" | null
    >(null);
    const [showTimeSheet, setShowTimeSheet] = useState(false);

    const hasTitle = (form.title ?? "").trim().length > 0;
    const submitLabel = mode === "create" ? "등록" : "수정";

    const isSubmitDisabled = !isClient || disabled || submitting || !hasTitle;

    const frequencyLabel =
        frequencyLabelOverride ?? getFrequencyLabel(form.frequency);

    const handleChange = <K extends keyof RoutineFormValue>(
        key: K,
        value: RoutineFormValue[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSelectDate = (
        field: "startDate" | "endDate",
        value: string
    ) => {
        const picked = new Date(value);
        picked.setHours(0, 0, 0, 0);

        if (field === "startDate" && form.endDate) {
            const end = new Date(form.endDate);
            end.setHours(0, 0, 0, 0);
            if (picked.getTime() > end.getTime()) {
                toastWarn(
                    "시작 날짜는 종료 날짜보다 이전 또는 같은 날이어야 해요"
                );
                return;
            }
        }

        if (field === "endDate" && form.startDate) {
            const start = new Date(form.startDate);
            start.setHours(0, 0, 0, 0);
            if (picked.getTime() < start.getTime()) {
                toastWarn("종료 날짜는 시작 날짜 이후로 선택해주세요");
                return;
            }
        }

        handleChange(field, value);
        setActiveDateField(null);
    };

    const handleFrequencyClick = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        }

        const params = new URLSearchParams();
        params.set("frequency", form.frequency);
        params.set("mode", mode);

        if (mode === "edit" && form.id != null) {
            params.set("routineId", String(form.id));

            if (
                (form.frequency === "WEEKLY" ||
                    form.frequency === "BIWEEKLY") &&
                form.weekDays
            ) {
                const nums = (form.weekDays ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => Number(s))
                    .filter((n) => !Number.isNaN(n))
                    .map((n) => n + 1);

                if (nums.length > 0) {
                    params.set("days", nums.join(","));
                }
            }

            if (form.frequency === "MONTHLY" && form.monthDays) {
                const tokens = (form.monthDays ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                const days: number[] = [];
                let last = false;

                tokens.forEach((t) => {
                    if (t === "L") {
                        last = true;
                        return;
                    }
                    const n = Number(t);
                    if (!Number.isNaN(n)) days.push(n);
                });

                if (days.length > 0) {
                    params.set("days", days.join(","));
                }
                if (last) {
                    params.set("last", "true");
                }
            }

            if (form.frequency === "YEARLY" && form.yearDays) {
                const tokens = (form.yearDays ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                const months: number[] = [];
                const days: number[] = [];
                let last = false;

                tokens.forEach((t) => {
                    if (t === "L") {
                        last = true;
                        return;
                    }
                    const [mStr, dStr] = t.split("-");
                    const m = Number(mStr);
                    const d = dStr ? Number(dStr) : NaN;

                    if (!Number.isNaN(m)) months.push(m);
                    if (!Number.isNaN(d)) days.push(d);
                });

                if (months.length > 0) {
                    params.set("months", months.join(","));
                }
                if (days.length > 0) {
                    params.set("days", days.join(","));
                }
                if (last) {
                    params.set("last", "true");
                }
            }
        }

        router.push(`/routine/frequency?${params.toString()}`);
    };

    const handleSubmit = async () => {
        await onSubmit(form);
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem(STORAGE_KEY);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSubmit();
    };

    const handleTimeConfirm = (value: string | null) => {
        handleChange("alarmTime", value);
        setShowTimeSheet(false);
    };

    useEffect(() => {
        if (!isClient) return;

        if (mode === "create") {
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        }
    }, [form, STORAGE_KEY, isClient, mode]);

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-5">
                    {/* 루틴 이름 + 색상 */}
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                                placeholder="루틴 제목을 입력해주세요."
                                className="input-box input-box--field"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowColorPicker((v) => !v)}
                            className="px-2 h-12.5 flex items-center justify-between rounded-xl border border-[var(--color-input-border)] bg-[--background] text-2xl"
                        >
                            <span
                                className="w-7 h-7 rounded-full mr-1"
                                style={{ backgroundColor: form.color }}
                            />

                            <Icon
                                icon="mdi:chevron-down"
                                width={18}
                                height={18}
                                className="text-[var(--color-super-dark-gray)]"
                            />
                        </button>
                    </div>

                    {/* 색상 팔레트 */}
                    {showColorPicker && (
                        <div className="px-1 flex items-center gap-3 flex-wrap">
                            {ROUTINE_COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                        handleChange("color", c);
                                        setShowColorPicker(false);
                                    }}
                                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                                    style={{
                                        borderColor:
                                            form.color === c
                                                ? "var(--color-opu-green)"
                                                : "transparent",
                                    }}
                                >
                                    <span
                                        className="w-[22px] h-[22px] rounded-full block"
                                        style={{ backgroundColor: c }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 시작 / 종료 날짜 */}
                    <div>
                        {/* 시작 날짜 */}
                        <div className="w-full mb-0.5">
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveDateField((prev) =>
                                        prev === "startDate"
                                            ? null
                                            : "startDate"
                                    )
                                }
                                className="input-box--field border border-[var(--color-super-light-gray)] rounded-t-[12px] flex items-center justify-between pl-4 pr-3"
                            >
                                <span
                                    style={{
                                        fontSize: "var(--text-sub)",
                                        color: "var(--color-dark-navy)",
                                    }}
                                >
                                    시작 날짜
                                </span>

                                <span className="flex items-center gap-1">
                                    <span
                                        style={{
                                            fontSize: "var(--text-sub)",
                                            fontWeight:
                                                "var(--weight-semibold)",
                                            color: "var(--color-dark-navy)",
                                        }}
                                    >
                                        {formatDateOrNone(form.startDate)}
                                    </span>

                                    <Icon
                                        icon="mdi:chevron-right"
                                        width={20}
                                        height={20}
                                        className="text-[var(--color-dark-gray)]"
                                    />
                                </span>
                            </button>
                        </div>

                        {activeDateField === "startDate" && (
                            <InlineCalendar
                                value={form.startDate}
                                onSelect={(v) =>
                                    handleSelectDate("startDate", v)
                                }
                            />
                        )}

                        {/* 종료 날짜 */}
                        <div className="w-full">
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveDateField((prev) =>
                                        prev === "endDate" ? null : "endDate"
                                    )
                                }
                                className="input-box--field border border-[var(--color-super-light-gray)] rounded-b-[12px] flex items-center justify-between pl-4 pr-3"
                            >
                                <span
                                    style={{
                                        fontSize: "var(--text-sub)",
                                        color: "var(--color-dark-navy)",
                                    }}
                                >
                                    종료 날짜
                                </span>

                                <span className="flex items-center gap-1">
                                    <span
                                        style={{
                                            fontSize: "var(--text-sub)",
                                            fontWeight:
                                                "var(--weight-semibold)",
                                            color: "var(--color-dark-navy)",
                                        }}
                                    >
                                        {formatDateOrNone(form.endDate)}
                                    </span>

                                    <Icon
                                        icon="mdi:chevron-right"
                                        width={20}
                                        height={20}
                                        className="text-[var(--color-dark-gray)]"
                                    />
                                </span>
                            </button>
                        </div>

                        {activeDateField === "endDate" && (
                            <InlineCalendar
                                value={form.endDate}
                                onSelect={(v) => handleSelectDate("endDate", v)}
                            />
                        )}
                    </div>

                    {/* 반복 */}
                    <div className="w-full relative">
                        <button
                            type="button"
                            onClick={handleFrequencyClick}
                            className="input-box-2 input-box--field flex items-center justify-between overflow-hidden px-4"
                        >
                            <span
                                style={{
                                    fontSize: "var(--text-sub)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                반복
                            </span>
                            <span
                                className="flex items-center gap-1"
                                style={{
                                    fontSize: "var(--text-sub)",
                                    fontWeight: "var(--weight-semibold)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                {frequencyLabel}
                                <Icon
                                    icon="mdi:chevron-right"
                                    width={20}
                                    height={20}
                                    className="text-[var(--color-dark-gray)]"
                                />
                            </span>
                        </button>
                    </div>

                    {/* 시간 */}
                    <div className="w-full relative">
                        <button
                            type="button"
                            onClick={() => setShowTimeSheet(true)}
                            className="input-box-2 input-box--field flex items-center justify-between overflow-hidden px-4"
                        >
                            <span
                                style={{
                                    fontSize: "var(--text-sub)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                시간
                            </span>

                            <span
                                className="flex items-center gap-1"
                                style={{
                                    fontSize: "var(--text-sub)",
                                    fontWeight: "var(--weight-semibold)",
                                    color: "var(--color-dark-navy)",
                                }}
                            >
                                {formatTimeOrNone(form.alarmTime)}
                                <Icon
                                    icon="mdi:chevron-right"
                                    width={20}
                                    height={20}
                                    className="text-[var(--color-dark-gray)]"
                                />
                            </span>
                        </button>
                    </div>

                    {/* 삭제 (edit 모드 전용) */}
                    {mode === "edit" && onDelete && (
                        <button
                            type="button"
                            onClick={() => {
                                if (onDeleteClick) {
                                    onDeleteClick();
                                } else {
                                    setShowDeleteConfirm(true);
                                }
                            }}
                            className="w-full h-[50px] rounded-[12px] border bg-white text-center"
                            style={{
                                borderColor: "var(--color-super-light-gray)",
                                color: "#FF4A4A",
                                fontSize: "var(--text-sub)",
                                fontWeight: "var(--weight-medium)",
                            }}
                        >
                            삭제
                        </button>
                    )}
                </div>

                {/* 하단 확인 버튼 */}
                <div className="mt-10 mb-4">
                    <OpuActionButton
                        label={submitLabel}
                        disabled={isSubmitDisabled}
                        loading={submitting}
                        onClick={() => {
                            void handleSubmit();
                        }}
                    />
                </div>

                {mode === "edit" && onDelete && !onDeleteClick && (
                    <ConfirmModal
                        isOpen={showDeleteConfirm}
                        message="이 루틴을 삭제하시겠습니까?"
                        onCancel={() => setShowDeleteConfirm(false)}
                        onConfirm={async () => {
                            setShowDeleteConfirm(false);
                            await onDelete();
                        }}
                    />
                )}
            </form>

            {/* 시간 선택 바텀시트 */}
            <BottomSheet
                open={showTimeSheet}
                onClose={() => setShowTimeSheet(false)}
                showHandle
            >
                <TimePickerSheet
                    current={form.alarmTime}
                    onConfirm={handleTimeConfirm}
                />
            </BottomSheet>
        </>
    );
}
