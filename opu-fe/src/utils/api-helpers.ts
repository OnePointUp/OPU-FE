import axios from "axios";

type ApiErrorPayload = {
    errorCode?: string;
    message?: string;
};

type ApiErrorWithResponse = {
    response?: {
        data?: ApiErrorPayload;
    };
};

export function extractErrorCode(err: unknown): string | undefined {
    const e = err as ApiErrorWithResponse;
    return e.response?.data?.errorCode;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        return (
            err.response?.data?.message ?? err.response?.data?.error ?? fallback
        );
    }
    if (err instanceof Error) return err.message;
    return fallback;
}
