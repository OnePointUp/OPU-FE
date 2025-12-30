"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SettingRow from "../components/SettingRow";
import ConfirmModal from "@/components/common/ConfirmModal";
import { memberWithdraw } from "@/features/member/services";
import { useLogout } from "../hooks/useLogout";
import { toastError } from "@/lib/toast";

type LinkItem = { label: string; href: string; disabled?: boolean };
type ActionItem = { label: string; onClick: () => void; disabled?: boolean };
type Item = LinkItem | ActionItem;

export default function SettingsSection({
    items,
    loading,
    isLocal,
}: {
    items: Item[];
    loading?: boolean;
    isLocal: boolean;
}) {
    const router = useRouter();
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    const { handleLogout } = useLogout();
    const [withdrawing, setWithdrawing] = useState(false);

    const handleSocialWithdraw = async () => {
        if (withdrawing) return;

        try {
            setWithdrawing(true);

            // 소셜 로그인 → 비밀번호 없이 탈퇴
            await memberWithdraw("");

            // 탈퇴 성공 → 로그아웃 처리
            handleLogout();
        } catch (e) {
            toastError("회원 탈퇴 중 문제가 발생했어요.");
        } finally {
            setWithdrawing(false);
            setWithdrawModalOpen(false);
        }
    };

    const handleWithdrawClick = () => {
        if (loading) return;

        if (!isLocal) {
            setWithdrawModalOpen(true);
            return;
        }

        router.push("/me/verify-password?mode=withdraw");
    };

    if (loading) return null;

    return (
        <section>
            <div>
                {items.map((it) => (
                    <SettingRow
                        key={it.label}
                        label={it.label}
                        {...("href" in it
                            ? { href: it.href }
                            : { onClick: it.onClick })}
                        disabled={it.disabled}
                    />
                ))}

                <div className="border-t border-[#F3F5F8] mt-1" />

                <button
                    type="button"
                    onClick={handleWithdrawClick}
                    className="h-12 w-full text-left text-[var(--color-light-gray)] opacity-70 hover:opacity-90 focus:outline-none cursor-pointer"
                    style={{ fontSize: "var(--text-caption)" }}
                >
                    회원 탈퇴
                </button>
            </div>

            {/* 소셜 로그인 탈퇴 안내 모달 */}
            <ConfirmModal
                isOpen={withdrawModalOpen}
                message={`정말 OPU를 탈퇴하시겠어요?\n탈퇴한 계정은 다시 복구할 수 없어요.`}
                onCancel={() => setWithdrawModalOpen(false)}
                onConfirm={handleSocialWithdraw}
                confirmDisabled={withdrawing}
            />
        </section>
    );
}
