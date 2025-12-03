import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toastError } from "@/lib/toast";
import { verifyCurrentPassword } from "../services";
import { extractErrorMessage } from "@/utils/api-helpers";

const VERIFIED_KEY = "pw-verified";
const CUR_CACHE_KEY = "pw-cur-cache";

export function useVerifyCurrentPassword() {
    const router = useRouter();
    const [cur, setCur] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangeCurrent = useCallback((value: string) => {
        setCur(value);
        setErr("");
    }, []);

    const handleNext = useCallback(async () => {
        if (!cur) {
            setErr("현재 비밀번호를 입력해 주세요.");
            return;
        }

        try {
            setLoading(true);

            await verifyCurrentPassword(cur);

            if (typeof window !== "undefined") {
                sessionStorage.setItem(VERIFIED_KEY, "1");
                sessionStorage.setItem(CUR_CACHE_KEY, cur);
            }

            router.push("/reset-password?mode=change");
        } catch (e: unknown) {
            const msg = extractErrorMessage(
                e,
                "비밀번호를 확인할 수 없습니다. 다시 시도해 주세요"
            );
            toastError(msg);
        } finally {
            setLoading(false);
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
    };
}
