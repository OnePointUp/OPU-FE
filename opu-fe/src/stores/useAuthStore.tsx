"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthMember = {
    id: number;
    email: string;
    nickname: string;
};

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    member: AuthMember | null;
    isAuthenticated: boolean;

    setAuth: (payload: {
        accessToken: string;
        refreshToken: string;
        member: AuthMember;
    }) => void;
    clearAuth: () => void;
    setMember: (member: AuthMember | null) => void;
};

const AUTH_COOKIE_NAME = "opu_session";

function setAuthCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; sameSite=lax`;
}

function clearAuthCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; sameSite=lax`;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            member: null,
            isAuthenticated: false,

            setAuth: ({ accessToken, refreshToken, member }) => {
                set({
                    accessToken,
                    refreshToken,
                    member,
                    isAuthenticated: true,
                });
                setAuthCookie();
            },

            clearAuth: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    member: null,
                    isAuthenticated: false,
                });
                clearAuthCookie();
            },

            setMember: (member) => {
                const { accessToken } = get();
                set({
                    member,
                    isAuthenticated: !!member && !!accessToken,
                });
            },
        }),
        {
            name: "opu-auth",

            onRehydrateStorage: () => (state, error) => {
                if (error) return;

                const hasToken = state?.accessToken && state?.refreshToken;

                if (hasToken) {
                    setAuthCookie();
                }
            },
        }
    )
);
