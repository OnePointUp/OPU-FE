"use client";

import { useRouter } from "next/navigation";
import SettingRow from "../components/SettingRow";

type LinkItem = { label: string; href: string; disabled?: boolean };
type ActionItem = { label: string; onClick: () => void; disabled?: boolean };
type Item = LinkItem | ActionItem;

export default function SettingsSection({
    items,
    loading,
}: {
    items: Item[];
    loading?: boolean;
}) {
    const router = useRouter();

    const handleWithdrawClick = () => {
        if (loading) return;
        router.push("/me/verify-password?mode=withdraw");
    };

    if (loading) {
        return null;
    }

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
                    className="h-12 w-full text-left text-[var(--color-light-gray)] opacity-70 hover:opacity-90 focus:opacity-90 focus:outline-none cursor-pointer"
                    style={{ fontSize: "var(--text-caption)" }}
                >
                    회원 탈퇴
                </button>
            </div>
        </section>
    );
}
