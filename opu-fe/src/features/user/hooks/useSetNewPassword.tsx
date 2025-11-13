// 비밀번호 변경 검증 훅

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword2 } from "@/features/user/services";
import { toastError, toastSuccess } from "@/lib/toast";

const VERIFIED_KEY = "pw-verified";
const CUR_CACHE_KEY = "pw-cur-cache";

function validateNew(pw: string): string {
    if (pw.length < 8) return "8자 이상 입력해주세요.";
    return "";
}

export function useSetNewPassword() {
    const router = useRouter();

    const [cur, setCur] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errNext, setErrNext] = useState("");
    const [errConfirm, setErrConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ok = sessionStorage.getItem(VERIFIED_KEY) === "1";
        const cached = sessionStorage.getItem(CUR_CACHE_KEY) ?? "";

        if (!ok || !cached) {
            router.replace("/me/password");
            return;
        }
        setCur(cached);
    }, [router]);

    const canSubmit = useMemo(
        () =>
            !loading &&
            next.length > 0 &&
            confirm.length > 0 &&
            !errNext &&
            !errConfirm,
        [loading, next, confirm, errNext, errConfirm]
    );

    const handleChangeNext = useCallback(
        (value: string) => {
            setNext(value);

            const nErr = validateNew(value);
            setErrNext(nErr);

            if (confirm) {
                setErrConfirm(
                    value === confirm ? "" : "일치하지 않는 비밀번호 입니다."
                );
            }
        },
        [confirm]
    );

    const handleChangeConfirm = useCallback(
        (value: string) => {
            setConfirm(value);
            setErrConfirm(
                value === next ? "" : "일치하지 않는 비밀번호 입니다."
            );
        },
        [next]
    );

    const handleSubmit = useCallback(async () => {
        const nErr = validateNew(next);
        const cErr = next !== confirm ? "일치하지 않는 비밀번호 입니다." : "";

        setErrNext(nErr);
        setErrConfirm(cErr);

        if (nErr || cErr) return;

        try {
            setLoading(true);
            await changePassword2(cur, next);

            if (typeof window !== "undefined") {
                sessionStorage.removeItem(VERIFIED_KEY);
                sessionStorage.removeItem(CUR_CACHE_KEY);
            }

            toastSuccess("비밀번호가 변경되었습니다");
            setTimeout(() => router.replace("/me"), 1000);
        } catch (e: unknown) {
            console.error(e);
            if (process.env.NODE_ENV == "development") {
                toastError(String(e));
            } else {
                toastError("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
            }
        } finally {
            setLoading(false);
        }
    }, [cur, next, confirm, router]);

    return {
        next,
        confirm,
        errNext,
        errConfirm,
        loading,
        canSubmit,
        handleChangeNext,
        handleChangeConfirm,
        handleSubmit,
    };
}
