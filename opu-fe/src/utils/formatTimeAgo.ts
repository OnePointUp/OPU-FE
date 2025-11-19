export function formatTimeAgo(input: string | Date): string {
    const date = typeof input === "string" ? new Date(input) : input;
    const diffMs = Date.now() - date.getTime();

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);

    if (min < 1) return "방금 전";
    if (min < 60) return `${min}분 전`;
    if (hour < 24) return `${hour}시간 전`;
    if (day === 1) return "어제";
    return `${day}일 전`;
}
