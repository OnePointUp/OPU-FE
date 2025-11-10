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
        <div className="app-page">
            <Header title="비밀번호 변경" />
            <main className="app-container pt-app-header pb-40">
                <section
                    className="w-full px-2 pb-24"
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
