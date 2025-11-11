"use client";

import { useEffect, useState } from "react";
import {
    fetchNotificationSettings,
    saveNotificationSettings,
} from "../services";
import type { NotificationSettings } from "../types";
import Group from "./Group";
import { toast } from "react-hot-toast";
import Toggle from "./Toggle";
import ToggleRow from "./ToggleRow";

export default function SettingsForm() {
    const [data, setData] = useState<NotificationSettings | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNotificationSettings().then(setData).catch(console.error);
    }, []);

    useEffect(() => {
        if (!data) return; // 가드
        const anyOn =
            data.morning ||
            data.evening ||
            data.routine ||
            data.todayTodo ||
            data.reminder1 ||
            data.reminder2;
        if (data.allEnabled !== anyOn) {
            setData((prev) => (prev ? { ...prev, allEnabled: anyOn } : prev));
        }
    }, [data]);

    const toggleAll = (v: boolean) => {
        if (!data) return;
        setData({
            ...data,
            allEnabled: v,
            morning: v,
            evening: v,
            routine: v,
            todayTodo: v,
            reminder1: v,
            reminder2: v,
        });
    };

    const onSave = async () => {
        if (!data) return;
        try {
            setSaving(true);
            await saveNotificationSettings(data);
            toast.success("저장되었습니다");
        } catch (e) {
            console.error(e);
            toast.error("저장 실패");
        } finally {
            setSaving(false);
        }
    };

    if (!data) return null;

    return (
        <div className="app-container pt-app-header pb-40">
            {/* 전체 알림 */}
            <div className="flex h-12 items-center justify-between px-4 mb-2 mt-3">
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
            <div className="h-[1px] bg-[var(--color-super-light-gray)]" />

            {/* 기본 알림 */}
            <Group title="기본 알림">
                <ToggleRow
                    label="아침 알림"
                    checked={data.morning}
                    onChange={(v) => setData({ ...data, morning: v })}
                />
                <ToggleRow
                    label="저녁 알림"
                    checked={data.evening}
                    onChange={(v) => setData({ ...data, evening: v })}
                />
            </Group>

            {/* 수행 관련 알림 */}
            <Group title="수행 관련 알림">
                <ToggleRow
                    label="루틴 알림"
                    checked={data.routine}
                    onChange={(v) => setData({ ...data, routine: v })}
                />
                <ToggleRow
                    label="오늘의 투두 알림"
                    checked={data.todayTodo}
                    onChange={(v) => setData({ ...data, todayTodo: v })}
                />
                <ToggleRow
                    label="알림 A"
                    checked={data.reminder1}
                    onChange={(v) => setData({ ...data, reminder1: v })}
                />
                <ToggleRow
                    label="알림 B"
                    checked={data.reminder2}
                    onChange={(v) => setData({ ...data, reminder2: v })}
                />
            </Group>
        </div>
    );
}
