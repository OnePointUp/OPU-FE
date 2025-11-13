"use client";

import Toggle from "@/components/common/Toggle";
import { useNotificationSettings } from "@/features/notification/hooks/useNotificationSettings";
import Group from "./Group";
import ToggleRow from "./ToggleRow";

export default function NotificationSettingsContent() {
    const { settings, loading, toggleAll, toggleOne } =
        useNotificationSettings();

    if (loading || !settings) {
        // 추후 skeleton 추가
        return (
            <div className="app-container pt-app-header pb-40 px-2">
                {/* 로딩 상태 UI */}
            </div>
        );
    }

    return (
        <div className="app-container pt-app-header pb-40">
            <div className="flex h-13 items-center justify-between px-2 mb-2 mt-3">
                <span
                    style={{
                        fontWeight: "var(--weight-regular)",
                        fontSize: "var(--text-body)",
                    }}
                >
                    전체 알림
                </span>
                <Toggle checked={settings.allEnabled} onChange={toggleAll} />
            </div>
            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6 mt-3" />

            {settings.sections.map((section) => (
                <Group key={section.id} title={section.type}>
                    {section.items.map((item) => (
                        <ToggleRow
                            key={item.key}
                            label={item.label}
                            description={item.description}
                            checked={item.enabled}
                            onChange={(v) => toggleOne(item.key, v)}
                        />
                    ))}
                </Group>
            ))}
        </div>
    );
}
