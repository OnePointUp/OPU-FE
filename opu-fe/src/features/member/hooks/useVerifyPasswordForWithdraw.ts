"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import {
    memberWithdraw,
    verifyCurrentPassword,
} from "@/features/member/services";
import { extractErrorMessage } from "@/utils/api-helpers";
import ConfirmModal from "@/components/common/ConfirmModal";

export function useVerifyPasswordForWithdraw() {
    const router = useRouter();
    const [cur, setCur] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleChangeCurrent = useCallback((value: string) => {
        setCur(value);
        setErr("");
    }, []);

    const handleNext = useCallback(() => {
        if (!cur) {
            setErr("현재 비밀번호를 입력해 주세요.");
            return;
        }
        setConfirmOpen(true);
    }, [cur]);

    const handleConfirmWithdraw = useCallback(async () => {
        try {
            setLoading(true);

            await memberWithdraw(cur);

            toastSuccess("회원 탈퇴가 완료되었어요.");
            router.push("/welcome");
        } catch (e: unknown) {
            const msg = extractErrorMessage(
                e,
                "요청을 처리할 수 없습니다. 다시 시도해 주세요."
            );
            toastError(msg);
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    }, [cur, router]);

    const canNext = !!cur && !loading;

    return {
        cur,
        err,
        loading,
        canNext,
        handleChangeCurrent,
        handleNext,
        confirmModalProps: {
            isOpen: confirmOpen,
            message:
                "정말 회원 탈퇴를 진행할까요?\n탈퇴 후에는 되돌릴 수 없어요.",
            onConfirm: handleConfirmWithdraw,
            onCancel: () => setConfirmOpen(false),
        } satisfies React.ComponentProps<typeof ConfirmModal>,
    };
}
