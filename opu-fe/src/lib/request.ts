const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function requestJSON<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const isAbsolute = /^https?:\/\//.test(path);
    const url = isAbsolute ? path : `${API_BASE}${path}`;

    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) {
        throw new Error(await res.text().catch(() => "Request failed"));
    }
    return res.json() as Promise<T>;
}
