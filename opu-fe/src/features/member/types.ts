export type MemberProfileSummary = {
    nickname: string;
    profileImageUrl: string | null;
    email: string;
    favoriteOpuCount: number;
    myOpuCount: number;
    bio: string;
};

export type MemberProfileDetail = {
    id: number;
    email: string;
    nickname: string;
    bio: string | null;
    profileImageUrl: string | null;
};

export type EditProfilePayload = {
    nickname: string;
    bio: string | null;
    profileImageUrl?: string;
};

export type PresignedUrlResponse = {
    uploadUrl: string;
    finalUrl: string;
};

export type PasswordCheckPayload = {
    password: string;
};
