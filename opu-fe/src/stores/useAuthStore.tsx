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
        member?: AuthMember | null;
    }) => void;
    clearAuth: () => void;
    setMember: (user: AuthMember | null) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            member: null,
            isAuthenticated: false,

            setAuth: ({ accessToken, refreshToken, member = null }) =>
                set({
                    accessToken,
                    refreshToken,
                    member,
                    isAuthenticated: !!accessToken,
                }),

            clearAuth: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    member: null,
                    isAuthenticated: false,
                });

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            },

            setMember: (member) =>
                set((s) => ({
                    ...s,
                    member,
                    isAuthenticated: !!member && !!s.accessToken,
                })),
        }),
        {
            name: "opu-auth",
        }
    )
);
