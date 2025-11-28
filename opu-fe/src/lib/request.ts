const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
const API_PATH = "/api";

export async function requestJSON<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const isAbsolute = /^https?:\/\//.test(path);
    const isServer = typeof window === "undefined";

    let url: string;

    if (isAbsolute) {
        url = path;
    } else {
        const apiPath = `${API_PATH}${path}`;

        url = isServer ? `${API_ORIGIN}${apiPath}` : apiPath;
    }

    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) {
        throw new Error(await res.text().catch(() => "Request failed"));
    }
    return res.json() as Promise<T>;
}
