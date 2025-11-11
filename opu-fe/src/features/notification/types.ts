export type NotificationKey =
    | "morning"
    | "evening"
    | "routine"
    | "todo"
    | "random";

export type NotificationItem = {
    key: NotificationKey;
    label: string;
    description: string;
    enabled: boolean;
};

export type NotificationSection = {
    id: string;
    type: string;
    items: NotificationItem[];
};

export type NotificationSettings = {
    allEnabled: boolean;
    sections: NotificationSection[];
};
