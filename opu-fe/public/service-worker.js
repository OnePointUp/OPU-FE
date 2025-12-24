self.addEventListener("push", (event) => {
    event.waitUntil(
        (async () => {
            if (!event.data) return;

            let payload = {};

            try {
                payload = event.data.json();
            } catch {
                payload = {
                    title: "OPU",
                    message: event.data.text(),
                };
            }

            const title = payload.title || "OPU";
            const body = payload.message || payload.body || "";
            const rawUrl = payload.url || "/notification";

            let url = rawUrl;
            try {
                const parsed = new URL(rawUrl, self.location.origin);
                if (parsed.origin !== self.location.origin) {
                    url =
                        parsed.pathname + parsed.search + parsed.hash ||
                        "/notification";
                } else {
                    url = parsed.pathname + parsed.search + parsed.hash;
                }
            } catch {
                url = "/notification";
            }

            await self.registration.showNotification(title, {
                body,
                icon: "/images/cabit_logo2.png",
                data: { url },
            });
        })()
    );
});

// 최신 워커를 바로 활성화하고 기존 탭도 제어
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const url = event.notification.data?.url || "/";
    event.waitUntil(
        (async () => {
            // 이미 열린 탭이 있으면 포커스+네비게이션, 없으면 새 창
            const allClients = await clients.matchAll({
                type: "window",
                includeUncontrolled: true,
            });

            for (const client of allClients) {
                if ("focus" in client) {
                    await client.focus();
                }

                // 기존 탭에서 이동시 히스토리가 유지돼 뒤로가기가 정상 동작
                if ("navigate" in client) {
                    await client.navigate(url);
                }
                return;
            }

            await clients.openWindow(url);
        })()
    );
});
