"use client";

import { useRouter } from "next/navigation";
import SettingRow from "../components/SettingRow";

type LinkItem = { label: string; href: string; disabled?: boolean };
type ActionItem = { label: string; onClick: () => void; disabled?: boolean };
type Item = LinkItem | ActionItem;

export default function SettingsSection({ items }: { items: Item[] }) {
    const router = useRouter();

    const handleWithdrawClick = () => {
        router.push("/me/verify-password?mode=withdraw");
    };

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

                <div className="border-t border-[#F3F5F8] my-2" />

                <button
                    type="button"
                    onClick={handleWithdrawClick}
                    className="h-12 w-full mx-1 text-left text-[var(--color-light-gray)] opacity-70 hover:opacity-90 focus:opacity-90 focus:outline-none"
                    style={{ fontSize: "var(--text-caption)" }}
                >
                    회원 탈퇴
                </button>
            </div>
        </section>
    );
}
