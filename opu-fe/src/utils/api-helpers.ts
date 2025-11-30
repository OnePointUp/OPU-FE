import axios from "axios";

export function extractErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        return (
            err.response?.data?.message ?? err.response?.data?.error ?? fallback
        );
    }
    if (err instanceof Error) return err.message;
    return fallback;
}
