"use client";

import SettingsList from "@/features/member/components/SettingsList";

type Item =
    | { label: string; href: string; onClick?: never }
    | { label: string; href?: never; onClick: () => void };

export default function SettingsSection({ items }: { items: Item[] }) {
    return <SettingsList items={items} />;
}
