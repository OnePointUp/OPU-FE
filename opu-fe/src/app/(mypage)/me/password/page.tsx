"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import PasswordInput from "@/features/user/components/PasswordInput";
import { verifyCurrentPassword } from "@/features/user/services";
import { toast } from "react-hot-toast";
import BottomActionBar from "@/components/common/BottomActionBar";

const VERIFIED_KEY = "pw-verified";
const CUR_CACHE_KEY = "pw-cur-cache";

export default function PasswordStep1() {
    const router = useRouter();
    const [cur, setCur] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const goNext = async () => {
        if (!cur) {
            setErr("현재 비밀번호를 입력해 주세요.");
            return;
        }
        try {
            setLoading(true);
            await verifyCurrentPassword(cur);
            sessionStorage.setItem(VERIFIED_KEY, "1");
            sessionStorage.setItem(CUR_CACHE_KEY, cur);
            router.push("/me/password/new");
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
                        label="현재 비밀번호"
                        value={cur}
                        onChange={(v) => {
                            setCur(v);
                            setErr("");
                        }}
                        placeholder="********"
                        error={err}
                    />
                </section>
            </main>

            <BottomActionBar
                label="다음"
                disabled={loading || !cur}
                onClick={goNext}
            />
        </div>
    );
}
