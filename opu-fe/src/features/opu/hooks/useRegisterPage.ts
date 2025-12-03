"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toastSuccess, toastError } from "@/lib/toast";
import {
    TIME_CODE_TO_MINUTES,
    type TimeCode,
    type RegisterOpuPayload,
} from "../domain";
import EmojiSelectSheet from "../components/EmojiSelectSheet";
import TimeSelectSheet from "../components/TimeSelectSheet";
import CategorySelectSheet from "../components/CategorySelectSheet";
import ConfirmModal from "@/components/common/ConfirmModal";
import { registerOpu } from "../service";

function toMinutes(code: TimeCode | undefined): number | null {
    if (!code || code === "ALL") return null;
    return TIME_CODE_TO_MINUTES[code];
}

type FormCoreValues = {
    title: string;
    description: string;
    isPublic: boolean;
};

export function useOpuRegisterPage() {
    const router = useRouter();

    const [emojiSheetOpen, setEmojiSheetOpen] = useState(false);
    const [timeSheetOpen, setTimeSheetOpen] = useState(false);
    const [categorySheetOpen, setCategorySheetOpen] = useState(false);

    const [emoji, setEmoji] = useState<string | undefined>("");
    const [timeLabel, setTimeLabel] = useState("");
    const [categoryLabel, setCategoryLabel] = useState("");

    const [timeCode, setTimeCode] = useState<TimeCode | undefined>();
    const [categoryId, setCategoryId] = useState<number | undefined>();

    const [submitting, setSubmitting] = useState(false);

    // 확인 모달용
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingForm, setPendingForm] = useState<FormCoreValues | null>(null);

    const validateBeforeConfirm = () => {
        if (!timeCode || timeCode === "ALL") {
            toastError("소요 시간을 선택해 주세요");
            return false;
        }
        if (!categoryId) {
            toastError("카테고리를 선택해 주세요");
            return false;
        }
        const minutes = toMinutes(timeCode);
        if (minutes == null) {
            toastError("유효하지 않은 소요 시간이에요");
            return false;
        }
        return true;
    };

    const handleConfirmRegister = async () => {
        if (!pendingForm) return;
        if (!timeCode || timeCode === "ALL" || !categoryId) return;

        const minutes = toMinutes(timeCode);
        if (minutes == null) return;

        const payload: RegisterOpuPayload = {
            title: pendingForm.title,
            description: pendingForm.description,
            emoji: emoji || "😀",
            requiredMinutes: minutes,
            isShared: pendingForm.isPublic,
            categoryId,
        };

        try {
            setSubmitting(true);
            await registerOpu(payload);
            toastSuccess("OPU가 등록되었어요");
            router.push("/opu/my");
        } catch (e) {
            console.error(e);
            toastError("OPU 등록에 실패했어요");
        } finally {
            setSubmitting(false);
            setConfirmOpen(false);
            setPendingForm(null);
        }
    };

    return {
        formProps: {
            mode: "create" as const,
            initialValues: {
                emoji,
                timeLabel,
                categoryLabel,
                isPublic: false,
            },
            submitting,
            onClickEmoji: () => setEmojiSheetOpen(true),
            onClickTime: () => setTimeSheetOpen(true),
            onClickCategory: () => setCategorySheetOpen(true),
            onSubmit: (values: FormCoreValues) => {
                // 유효성 체크 먼저
                if (!validateBeforeConfirm()) return;

                // 확인 모달에 넘길 값 저장
                setPendingForm(values);
                setConfirmOpen(true);
            },
        },
        emojiSheetProps: {
            open: emojiSheetOpen,
            selected: emoji,
            onClose: () => setEmojiSheetOpen(false),
            onSelect: (e: string) => {
                setEmoji(e);
                setEmojiSheetOpen(false);
            },
        } satisfies React.ComponentProps<typeof EmojiSelectSheet>,
        timeSheetProps: {
            open: timeSheetOpen,
            selectedCode: timeCode,
            onClose: () => setTimeSheetOpen(false),
            onSelect: ({ code, label }: { code: TimeCode; label: string }) => {
                setTimeCode(code);
                setTimeLabel(label);
                setTimeSheetOpen(false);
            },
        } satisfies React.ComponentProps<typeof TimeSelectSheet>,
        categorySheetProps: {
            open: categorySheetOpen,
            selectedId: categoryId,
            onClose: () => setCategorySheetOpen(false),
            onSelect: ({ id, label }: { id: number; label: string }) => {
                setCategoryId(id);
                setCategoryLabel(label);
                setCategorySheetOpen(false);
            },
        } satisfies React.ComponentProps<typeof CategorySelectSheet>,
        confirmModalProps: {
            isOpen: confirmOpen,
            message: "OPU를 등록할까요?\n등록하면 수정할 수 없습니다.",
            onConfirm: handleConfirmRegister,
            onCancel: () => {
                setConfirmOpen(false);
                setPendingForm(null);
            },
        } satisfies React.ComponentProps<typeof ConfirmModal>,
    };
}
