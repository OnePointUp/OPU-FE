import type { OpuTodoCreateDto } from "./types";

export function buildOpuTodoPayload(): OpuTodoCreateDto {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return {
        scheduledDate: `${yyyy}-${mm}-${dd}`,
        scheduledTime: null,
    };
}
