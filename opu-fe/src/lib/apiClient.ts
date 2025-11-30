"use client";

import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { AuthMember } from "@/stores/useAuthStore";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

let isRefreshing = false;

type FailedRequest = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token: string | null): void {
    failedQueue.forEach((promise) => {
        if (error || !token) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
}

function setAuthHeader(config: AxiosRequestConfig, token: string): void {
    if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
    }
    (
        config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
}

async function getNewAccessToken(instance: AxiosInstance): Promise<string> {
    const { refreshToken, setAuth, clearAuth, member } =
        useAuthStore.getState();

    if (!refreshToken) {
        clearAuth();
        throw new Error("리프레시 토큰이 없습니다. 로그아웃 처리됩니다.");
    }

    type RefreshResponseData = {
        accessToken: string;
        refreshToken: string;
        member?: AuthMember;
    };

    try {
        const response = await instance.post<RefreshResponseData>(
            "/auth/refresh",
            { refreshToken }
        );
        const data = response.data;

        const nextMember = data.member ?? member;

        if (!nextMember) {
            clearAuth();
            throw new Error("유저 정보를 찾을 수 없습니다.");
        }

        setAuth({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            member: nextMember,
        });

        return data.accessToken;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Token Refresh Failed:", error.response?.data);
        }
        clearAuth();
        throw error;
    }
}

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

/* 요청 인터셉터: 토큰 자동 첨부 또는 skipAuth 처리 */
const requestInterceptor = (
    config: AxiosRequestConfig
): InternalAxiosRequestConfig => {
    if (config.skipAuth) {
        return config as InternalAxiosRequestConfig;
    }

    const token = useAuthStore.getState().accessToken;
    if (token) {
        if (!config.headers) config.headers = {} as AxiosRequestHeaders;
        (
            config.headers as Record<string, string>
        ).Authorization = `Bearer ${token}`;
    }
    return config as InternalAxiosRequestConfig;
};

/* 응답 인터셉터: 401 에러 처리 및 토큰 재발급 로직 */
const responseInterceptor = async (error: AxiosError) => {
    // error.config는 타입 보강된 AxiosRequestConfig가 아닐 수 있으므로 단언이 필요
    const originalConfig = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;

    // 1. 기본 가드: 재시도 중이거나 401 에러가 아니면 즉시 실패 처리
    if (!originalConfig || originalConfig._retry || status !== 401) {
        return Promise.reject(error);
    }

    const url = originalConfig.url ?? "";

    // 2. 인증 관련 엔드포인트 예외 처리: 재발급 시도 방지
    const isAuthPath =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/password") ||
        url.includes("/auth/refresh");

    if (isAuthPath) {
        return Promise.reject(error);
    }

    const { accessToken, refreshToken, clearAuth } = useAuthStore.getState();

    // 3. 토큰 자체가 없는 상태: 로그아웃 처리 후 실패
    if (!accessToken || !refreshToken) {
        clearAuth();
        return Promise.reject(error);
    }

    // 4. 재시도 플래그 설정 (Module Augmentation 덕분에 타입 에러 없음)
    originalConfig._retry = true;

    // 5. 이미 토큰 재발급 요청 중인 경우: 큐에 요청을 넣고 대기
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({
                resolve: (token: string) => {
                    setAuthHeader(originalConfig, token);
                    resolve(apiClient(originalConfig));
                },
                reject,
            });
        });
    }

    // 6. 재발급 요청 시작
    isRefreshing = true;

    try {
        const newToken = await getNewAccessToken(apiClient);
        processQueue(null, newToken);

        setAuthHeader(originalConfig, newToken);
        return apiClient(originalConfig);
    } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        return Promise.reject(refreshError);
    } finally {
        isRefreshing = false;
    }
};

apiClient.interceptors.request.use(requestInterceptor, (error) =>
    Promise.reject(error)
);
apiClient.interceptors.response.use(
    (response) => response,
    responseInterceptor
);
