import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import { notificationTypes } from "./notification-type.db";

const nowIso = () => new Date().toISOString();

export type MemberNotificationSettingRow = {
    id: number;
    member_id: number;
    notification_type_id: number;
    enabled: boolean;
    updated_at: string | null;
};

// 초기값: 각 알림타입의 default_enabled 기준으로 현재 유저 설정 생성
export const memberNotificationSettings: MemberNotificationSettingRow[] =
    notificationTypes.map((type, idx) => ({
        id: idx + 1,
        member_id: CURRENT_MEMBER_ID,
        notification_type_id: type.id,
        enabled: type.default_enabled,
        updated_at: null,
    }));

export function updateAllForMember(memberId: number, enabled: boolean) {
    memberNotificationSettings.forEach((s) => {
        if (s.member_id === memberId) {
            s.enabled = enabled;
            s.updated_at = nowIso();
        }
    });
}

export function upsertOneForMember(
    memberId: number,
    notificationTypeId: number,
    enabled: boolean
) {
    const found = memberNotificationSettings.find(
        (s) =>
            s.member_id === memberId &&
            s.notification_type_id === notificationTypeId
    );

    if (found) {
        found.enabled = enabled;
        found.updated_at = nowIso();
        return;
    }

    memberNotificationSettings.push({
        id: memberNotificationSettings.length + 1,
        member_id: memberId,
        notification_type_id: notificationTypeId,
        enabled,
        updated_at: nowIso(),
    });
}
