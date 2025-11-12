// src/features/notification/components/SettingsForm.tsx
"use client";

import { useEffect, useState } from "react";
import {
    fetchNotificationSettings,
    patchNotificationItem,
    setAllNotifications,
} from "../services";
import type { NotificationSettings, NotificationKey } from "../types";
import Group from "./Group";
import Toggle from "../../../components/common/Toggle";
import ToggleRow from "./ToggleRow";
import { toastError } from "@/lib/toast";

export default function SettingsForm() {
    const [data, setData] = useState<NotificationSettings | null>(null);

    useEffect(() => {
        fetchNotificationSettings().then(setData).catch(console.error);
    }, []);

    const toggleAll = async (v: boolean) => {
        if (!data) return;
        const optimistic: NotificationSettings = {
            ...data,
            allEnabled: v,
            sections: data.sections.map((sec) => ({
                ...sec,
                items: sec.items.map((it) => ({ ...it, enabled: v })),
            })),
        };
        setData(optimistic);
        try {
            const saved = await setAllNotifications(v);
            setData(saved);
        } catch (e) {
            console.error(e);
            toastError("저장 실패");
            setData(data);
        }
    };

    const toggleOne = async (key: NotificationKey, v: boolean) => {
        if (!data) return;
        const optimistic: NotificationSettings = {
            ...data,
            sections: data.sections.map((sec) => ({
                ...sec,
                items: sec.items.map((it) =>
                    it.key === key ? { ...it, enabled: v } : it
                ),
            })),
        };
        setData(optimistic);
        try {
            const saved = await patchNotificationItem(key, v);
            setData(saved);
        } catch (e) {
            console.error(e);
            toastError("저장 실패");
            setData(data);
        }
    };

    if (!data) return null;

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
                <Toggle checked={data.allEnabled} onChange={toggleAll} />
            </div>
            <div className="h-[1px] bg-[var(--color-super-light-gray)] -mx-6 mt-3" />

            {data.sections.map((section) => (
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
