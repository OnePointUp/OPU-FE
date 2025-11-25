export async function requestJSON<T>(
    url: string,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) {
        throw new Error(await res.text().catch(() => "Request failed"));
    }
    return res.json() as Promise<T>;
}
