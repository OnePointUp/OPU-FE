"use client";

import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosRequestHeaders,
} from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

type ExtendedConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach((p) => {
        if (error || !token) p.reject(error);
        else p.resolve(token);
    });
    failedQueue = [];
}

function setAuthHeader(config: ExtendedConfig, token: string) {
    if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
    }
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
}

async function refreshTokenRequest(instance: AxiosInstance): Promise<string> {
    const { refreshToken, setAuth, clearAuth, member } =
        useAuthStore.getState();

    if (!refreshToken) {
        clearAuth();
        throw new Error("리프레시 토큰 없음");
    }

    const res = await instance.post("/auth/refresh", { refreshToken });

    const data = res.data as {
        accessToken: string;
        refreshToken: string;
        member?: typeof member;
    };

    const nextMember = data.member ?? member;

    if (!nextMember) {
        clearAuth();
        throw new Error("유저 정보 없음");
    }

    setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        member: nextMember,
    });

    return data.accessToken;
}

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

/* 요청 인터셉터 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }
            (
                config.headers as AxiosRequestHeaders
            ).Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* 응답 인터셉터 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalConfig = error.config as ExtendedConfig | undefined;
        const status = error.response?.status;

        // 기본 가드: 재시도 중이거나 401 아니면 건들지 않음
        if (!originalConfig || originalConfig._retry || status !== 401) {
            return Promise.reject(error);
        }

        const url = originalConfig.url ?? "";

        // 1) auth 관련 엔드포인트면 토큰 리프레시 시도하지 말고 그냥 실패로 넘김
        if (
            url.includes("/auth/login") ||
            url.includes("/auth/signup") ||
            url.includes("/auth/password") ||
            url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        const { accessToken, refreshToken, clearAuth } =
            useAuthStore.getState();

        // 2) 애초에 로그인 안 된 상태 (토큰 없음) -> 리프레시 시도 X
        if (!accessToken || !refreshToken) {
            clearAuth();
            return Promise.reject(error);
        }

        originalConfig._retry = true;

        // 여기부터는 진짜 토큰 만료 케이스만 옴
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

        isRefreshing = true;

        try {
            const newToken = await refreshTokenRequest(apiClient);
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
    }
);
