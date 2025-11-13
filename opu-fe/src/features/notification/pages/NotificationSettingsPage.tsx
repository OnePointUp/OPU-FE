"use client";

import Header from "@/components/layout/Header";
import NotificationSettingsContent from "@/features/notification/components/NotificationSettingsContent";

export default function NotificationSettingsPage() {
    return (
        <div className="app-page">
            <Header title="알림 설정" showBack />
            <NotificationSettingsContent />
        </div>
    );
}
