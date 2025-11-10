"use client";
import SettingRow from "./SettingRow";

type LinkItem = { label: string; href: string; disabled?: boolean };
type ActionItem = { label: string; onClick: () => void; disabled?: boolean };
type Item = LinkItem | ActionItem;

export default function SettingsList({
    items,
    onWithdraw,
}: {
    items: Item[];
    onWithdraw?: () => void;
}) {
    return (
        <section
            className="w-full mt-2"
            style={{ width: "min(100%, var(--app-max))" }}
        >
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

            <div className="mt-2 border-t border-[#F3F5F8]" />

            <button
                type="button"
                onClick={onWithdraw}
                className="h-12 w-full px-2 text-left text-[var(--color-light-gray)] opacity-70 hover:opacity-90 focus:opacity-90 focus:outline-none"
                style={{ fontSize: "var(--text-sub)" }}
            >
                회원 탈퇴
            </button>
        </section>
    );
}
