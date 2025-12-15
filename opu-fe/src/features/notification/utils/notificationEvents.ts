"use client";

const NOTIFICATION_EVENT = "opu:notification:incoming";

export function emitNotificationIncoming<T>(data: T) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent<T>(NOTIFICATION_EVENT, { detail: data })
    );
}

export function subscribeNotificationIncoming<T>(handler: (data: T) => void) {
    if (typeof window === "undefined") return () => {};

    const listener = (event: Event) => {
        const customEvent = event as CustomEvent<T>;
        handler(customEvent.detail);
    };

    window.addEventListener(NOTIFICATION_EVENT, listener);

    return () => window.removeEventListener(NOTIFICATION_EVENT, listener);
}
