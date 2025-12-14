"use client";

import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosRequestHeaders,
} from "axios";
import { useAuthStore, type AuthMember } from "@/stores/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

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

type RefreshResponseData = {
    accessToken: string;
    refreshToken: string;
    member?: AuthMember;
};

async function getNewAccessToken(instance: AxiosInstance): Promise<string> {
    const { refreshToken, setAuth, clearAuth, member } =
        useAuthStore.getState();

    if (!refreshToken) {
        throw new Error("리프레시 토큰이 없습니다. 로그아웃 처리됩니다.");
    }

    try {
        const response = await instance.post<RefreshResponseData>(
            "/auth/refresh",
            { refreshToken },
            { skipAuth: true }
        );

        const data = response.data;
        const nextMember = data.member ?? member;

        if (!nextMember) {
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
apiClient.interceptors.request.use(
    (config) => {
        if (config.skipAuth) {
            return config;
        }

        const token = useAuthStore.getState().accessToken;
        if (token) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }
            (
                config.headers as Record<string, string>
            ).Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* 응답 인터셉터: 401 에러 처리 및 토큰 재발급 로직 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalConfig = error.config as AxiosRequestConfig | undefined;
        const status = error.response?.status;

        // config 없음 or 이미 재시도 or 401 아님 → 그냥 실패
        if (!originalConfig || originalConfig._retry || status !== 401) {
            return Promise.reject(error);
        }

        const url = originalConfig.url ?? "";

        // 인증 관련 엔드포인트는 재발급 시도하지 않음
        const isAuthPath =
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/find-pw") ||
            url.includes("/auth/password/check") ||
            url.includes("/auth/refresh");

        if (isAuthPath) {
            return Promise.reject(error);
        }

        const { accessToken, refreshToken, clearAuth } =
            useAuthStore.getState();

        // 토큰 자체가 없으면 재시도 안 하고 로그아웃 처리
        if (!accessToken || !refreshToken) {
            clearAuth();
            return Promise.reject(error);
        }

        originalConfig._retry = true;

        if (isRefreshing) {
            // 이미 재발급 중이면 큐에 쌓고 기다렸다가 재요청
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

        isRefreshing = true;

        try {
            const newToken = await getNewAccessToken(apiClient);
            processQueue(null, newToken);

            setAuthHeader(originalConfig, newToken);
            return apiClient(originalConfig);
        } catch (refreshError) {
            processQueue(refreshError, null);
            clearAuth();

            if (typeof window !== "undefined") {
                window.location.href = "/welcome";
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
