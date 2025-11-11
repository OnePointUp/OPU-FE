"use client";

import Header from "@/components/layout/Header";
import SettingsForm from "@/features/notification/components/SettingsForms";

export default function NotificationPage() {
    return (
        <div className="app-page">
            <Header title="알림 설정" show={true} showBack />
            <SettingsForm />
        </div>
    );
}
