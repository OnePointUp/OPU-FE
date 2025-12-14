"use client";

import { fetchWebPushStatus } from "@/features/notification/services";

export const PUSH_PROMPT_KEY = "opu_push_prompt_v1";

export async function syncPushPromptKey() {
    try {
        const status = await fetchWebPushStatus();

        if (status.webPushAgreed) {
            localStorage.setItem(PUSH_PROMPT_KEY, "1");
        } else {
            localStorage.removeItem(PUSH_PROMPT_KEY);
        }
    } catch {
        localStorage.setItem(PUSH_PROMPT_KEY, "1");
    }
}
