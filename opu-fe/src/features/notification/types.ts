export type NotificationSettings = {
    allEnabled: boolean;

    // 기본 알림
    morning: boolean;
    evening: boolean;

    // 수행 관련 알림
    routine: boolean;
    todayTodo: boolean;
    reminder1: boolean;
    reminder2: boolean;
};
