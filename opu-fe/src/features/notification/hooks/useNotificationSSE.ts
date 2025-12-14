"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

type SseState = "idle" | "connecting" | "open" | "error" | "closed";

type ConnectEvent = { type: "connect"; data: string };
type PingEvent = { type: "ping"; data: string };
type NotificationEvent<T> = { type: "notification"; data: T };

export type SseEvent<T> = ConnectEvent | PingEvent | NotificationEvent<T>;

type Options<T> = {
    enabled?: boolean;
    onEvent?: (e: SseEvent<T>) => void;
    onOpen?: () => void;
    onError?: (err: unknown) => void;
};

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

function safeJson<T>(raw: string): T | null {
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function parseSseChunk<T>(chunk: string): Array<SseEvent<T>> {
    let eventName = "";
    const dataLines: string[] = [];

    for (const line of chunk.split("\n")) {
        if (line.startsWith("event:")) {
            eventName = line.replace("event:", "").trim();
        } else if (line.startsWith("data:")) {
            dataLines.push(line.replace("data:", "").trimStart());
        }
    }

    if (!eventName) eventName = "notification";
    const dataRaw = dataLines.join("\n");

    if (eventName === "notification" || eventName === "message") {
        const dto = safeJson<T>(dataRaw);
        if (!dto) return [];
        return [{ type: "notification", data: dto }];
    }

    if (eventName === "connect") return [{ type: "connect", data: dataRaw }];
    if (eventName === "ping") return [{ type: "ping", data: dataRaw }];

    return [];
}

export function useNotificationSse<T>({
    enabled = true,
    onEvent,
    onOpen,
    onError,
}: Options<T> = {}) {
    const [state, setState] = useState<SseState>("idle");
    const abortRef = useRef<AbortController | null>(null);

    const token = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        if (!enabled) return;

        if (!token) return;

        const ac = new AbortController();
        abortRef.current = ac;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState("connecting");

        (async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/notifications/stream`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "text/event-stream",
                            Authorization: `Bearer ${token}`,
                        },
                        signal: ac.signal,
                        cache: "no-store",
                    }
                );

                if (res.status === 401) {
                    setState("error");
                    onError?.(new Error("SSE 401 (unauthorized)"));
                    return;
                }

                if (!res.ok || !res.body) {
                    setState("error");
                    onError?.(new Error(`SSE failed: ${res.status}`));
                    return;
                }

                setState("open");
                onOpen?.();

                const reader = res.body.getReader();
                const decoder = new TextDecoder("utf-8");

                let buffer = "";

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    let idx: number;
                    while ((idx = buffer.indexOf("\n\n")) >= 0) {
                        const chunk = buffer.slice(0, idx);
                        buffer = buffer.slice(idx + 2);

                        const events = parseSseChunk<T>(chunk);
                        for (const e of events) onEvent?.(e);
                    }
                }

                setState("closed");
            } catch (err) {
                if (ac.signal.aborted) {
                    setState("closed");
                    return;
                }
                setState("error");
                onError?.(err);
            }
        })();

        return () => {
            ac.abort();
            abortRef.current = null;
            setState("closed");
        };
    }, [enabled, onEvent, onOpen, onError]);

    const close = () => {
        abortRef.current?.abort();
        abortRef.current = null;
        setState("closed");
    };

    return { state, close };
}
