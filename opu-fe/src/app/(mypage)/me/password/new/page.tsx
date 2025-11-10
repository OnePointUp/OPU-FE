"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import PasswordInput from "@/features/user/components/PasswordInput";
import { changePassword2 } from "@/features/user/services";
import { toast } from "react-hot-toast";
import BottomActionBar from "@/components/common/BottomActionBar";

const VERIFIED_KEY = "pw-verified";
const CUR_CACHE_KEY = "pw-cur-cache";

function validateNew(pw: string): string {
    if (pw.length < 8) return "8자 이상 입력해 주세요.";
    return "";
}

export default function PasswordStep2() {
    const router = useRouter();
    const [cur, setCur] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errNext, setErrNext] = useState("");
    const [errConfirm, setErrConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

    const onSubmit = async () => {
        const nErr = validateNew(next);
        const cErr = next !== confirm ? "일치하지 않는 비밀번호 입니다." : "";
        setErrNext(nErr);
        setErrConfirm(cErr);
        if (nErr || cErr) return;

        try {
            setLoading(true);
            await changePassword2(cur, next);
            sessionStorage.removeItem(VERIFIED_KEY);
            sessionStorage.removeItem(CUR_CACHE_KEY);
            toast.success("비밀번호가 변경되었습니다");
            setTimeout(() => router.replace("/me"), 1000);
        } catch (e: unknown) {
            console.error(e);
            if (process.env.NODE_ENV === "development") {
                toast.error(String(e));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-[var(--background)]">
            <Header title="비밀번호 변경" />
            <main
                className="w-full flex flex-col items-center"
                style={{ paddingTop: "calc(56px + var(--safe-top) + 10px)" }}
            >
                <section
                    className="w-full px-5 pb-24"
                    style={{ width: "min(100%, var(--app-max))" }}
                >
                    <PasswordInput
                        label="새 비밀번호"
                        value={next}
                        onChange={(v) => {
                            setNext(v);
                            const ve = validateNew(v);
                            setErrNext(ve);
                            if (confirm)
                                setErrConfirm(
                                    v === confirm
                                        ? ""
                                        : "일치하지 않는 비밀번호 입니다."
                                );
                        }}
                        placeholder="@LwEoLgXgU7"
                        error={errNext}
                    />
                    <PasswordInput
                        label="비밀번호 확인"
                        value={confirm}
                        onChange={(v) => {
                            setConfirm(v);
                            setErrConfirm(
                                v === next
                                    ? ""
                                    : "일치하지 않는 비밀번호 입니다."
                            );
                        }}
                        placeholder="@LwEoLgXgU7"
                        error={errConfirm}
                    />
                </section>
            </main>

            <BottomActionBar
                label="저장"
                disabled={!canSubmit}
                onClick={onSubmit}
            />
        </div>
    );
}
