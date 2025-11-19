"use client";

import SettingsList from "@/features/user/components/SettingsList";

type Item =
    | { label: string; href: string; onClick?: never }
    | { label: string; href?: never; onClick: () => void };

export default function SettingsSection({ items }: { items: Item[] }) {
    return (
        <div className="app-container pt-app-header pb-40 px-6">
            <SettingsList items={items} />
        </div>
    );
}
