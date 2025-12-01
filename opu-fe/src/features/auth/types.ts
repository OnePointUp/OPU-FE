import { AuthMember } from "@/stores/useAuthStore";

export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresInSeconds: number;
    refreshExpiresInSeconds: number;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    member: AuthMember;
};

export type EmailSignupPayload = {
    email: string;
    password: string;
    nickname: string;
};

export type EmailVerifyStatusResponse = {
    verified: boolean;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type PasswordCheckPayload = {
    password: string;
};

export type ResetPasswordByTokenPayload = {
    token: string;
    newPassword: string;
};
