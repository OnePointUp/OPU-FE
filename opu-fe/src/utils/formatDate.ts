export function formatDate(iso?: string): string {
    if (!iso) return "";
    try {
        const date = new Date(iso);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .format(date)
            .replace(/\. /g, ".")
            .replace(/\.$/, "");
    } catch {
        return "";
    }
}
