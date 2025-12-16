"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toastSuccess, toastError } from "@/lib/toast";
import {
    TIME_CODE_TO_MINUTES,
    type TimeCode,
    type RegisterOpuPayload,
    type OpuDuplicateItem,
} from "../domain";

import EmojiSelectSheet from "../components/EmojiSelectSheet";
import TimeSelectSheet from "../components/TimeSelectSheet";
import CategorySelectSheet from "../components/CategorySelectSheet";
import ConfirmModal from "@/components/common/ConfirmModal";
import OpuDuplicateListModal from "../components/OpuDuplicateListModal";

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

    /** 확인 모달 */
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingForm, setPendingForm] = useState<FormCoreValues | null>(null);

    /** 중복 OPU 모달 */
    const [duplicateListOpen, setDuplicateListOpen] = useState(false);
    const [duplicates, setDuplicates] = useState<OpuDuplicateItem[]>([]);

    /* -----------------------------
       유효성 검사
    ----------------------------- */
    const validateBeforeConfirm = (values: FormCoreValues) => {
        if (!values.title || values.title.trim().length < 2) {
            toastError("OPU 제목은 최소 2자 이상 입력해 주세요");
            return false;
        }

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

    /* -----------------------------
       등록 확정
    ----------------------------- */
    const buildRegisterPayload = (
        isShared: boolean
        ): RegisterOpuPayload | null => {
        if (!pendingForm || !timeCode || timeCode === "ALL" || !categoryId) {
            return null;
        }

        const minutes = toMinutes(timeCode);
        if (minutes == null) return null;

        return {
            title: pendingForm.title,
            description: pendingForm.description,
            emoji: emoji || "😀",
            requiredMinutes: minutes,
            isShared,
            categoryId,
        };
    };

    const handleConfirmRegister = async () => {
        const payload = buildRegisterPayload(pendingForm?.isPublic ?? false);
        if (!payload) return;

        setSubmitting(true);

        try {
            const result = await registerOpu(payload);

            if (result.created) {
            toastSuccess("OPU가 등록되었어요");
            router.push("/opu/my");
            return;
            }

            setConfirmOpen(false);
            setTimeout(() => {
            setDuplicates(result.duplicates);
            setDuplicateListOpen(true);
            }, 0);
        } catch {
            toastError("OPU 등록에 실패했어요.");
        } finally {
            setSubmitting(false);
        }
    };

    return {
        /* =============================
           Form
        ============================= */
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
                if (!validateBeforeConfirm(values)) return;
                setPendingForm(values);
                setConfirmOpen(true);
            },
        },

        /* =============================
           Emoji Sheet
        ============================= */
        emojiSheetProps: {
            open: emojiSheetOpen,
            selected: emoji,
            onClose: () => setEmojiSheetOpen(false),
            onSelect: (e: string) => {
                setEmoji(e);
                setEmojiSheetOpen(false);
            },
        } satisfies React.ComponentProps<typeof EmojiSelectSheet>,

        /* =============================
           Time Sheet
        ============================= */
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

        /* =============================
           Category Sheet
        ============================= */
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

        /* =============================
           Confirm Modal
        ============================= */
        confirmModalProps: {
            isOpen: confirmOpen,
            message: "OPU를 등록할까요?\n등록하면 수정할 수 없습니다.",
            onConfirm: handleConfirmRegister,
            onCancel: () => {
                setConfirmOpen(false);
                setPendingForm(null);
            },
        } satisfies React.ComponentProps<typeof ConfirmModal>,

        /* =============================
           Duplicate OPU Modal
        ============================= */
        duplicateListModalProps: {
            open: duplicateListOpen,
            mode: "create",
            duplicates,
            onSelectOpu: (opuId: number) => {
                router.push(`/opus/${opuId}`);
            },
            onCreatePrivate: async () => {
                const payload = buildRegisterPayload(false);
                if (!payload) return;

                try {
                    await registerOpu(payload);
                    toastSuccess("비공개 OPU로 등록했어요");
                    router.push("/opu/my");
                } catch {
                    toastError("OPU 등록에 실패했어요.");
                }
            },
            onClose: () => {
                setDuplicateListOpen(false);
                setDuplicates([]);
            },
        } satisfies React.ComponentProps<typeof OpuDuplicateListModal>,
    };
}
