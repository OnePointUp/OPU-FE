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

function refineValidationMessage(message: string): string {
    // 패턴: [... : 실제 에러메시지]
    // 예) "입력 값 검증 오류입니다.[password : 비밀번호는 8자 이상 128자 이하로 입력해야 합니다.]"
    const match = message.match(/\[[^:]+:\s*([^\]]+)\]/);

    if (match && match[1]) {
        return match[1].trim();
    }

    return message;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
        const resData = err.response?.data;

        if (resData && typeof resData === "object") {
            const raw =
                (resData as { message?: unknown }).message ??
                (resData as { error?: unknown }).error;

            if (typeof raw === "string" && raw.length > 0) {
                return refineValidationMessage(raw);
            }
        }

        return fallback;
    }

    if (err instanceof Error) return err.message;

    return fallback;
}
