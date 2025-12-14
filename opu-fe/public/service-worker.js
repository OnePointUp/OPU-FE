self.addEventListener("push", (event) => {
    event.waitUntil(
        (async () => {
            if (!event.data) return;

            let payload = {};

            try {
                payload = event.data.json(); // 백엔드 JSON payload
            } catch {
                payload = {
                    title: "OPU",
                    message: event.data.text(),
                };
            }

            const title = payload.title || "OPU";
            const body = payload.message || payload.body || "";
            const url = payload.url || "/notification";

            await self.registration.showNotification(title, {
                body,
                data: { url },
            });
        })()
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data?.url || "/";
    event.waitUntil(clients.openWindow(url));
});
