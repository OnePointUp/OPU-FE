"use client";

import SettingsList from "@/features/member/components/SettingsList";
import { useRouter } from "next/navigation";

type Item =
    | { label: string; href: string; onClick?: never }
    | { label: string; href?: never; onClick: () => void };

export default function SettingsSection({ items }: { items: Item[] }) {
    const router = useRouter();

    const handleWithdrawClick = () => {
        router.push("/me/verify-password?mode=withdraw");
    };

    return (
        <section>
            <SettingsList items={items} onWithdraw={handleWithdrawClick} />
        </section>
    );
}
