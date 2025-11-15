// 간단한 Member Entity 구조
export type MemberEntity = {
    id: number;
    nickname: string;
    profileImage?: string | null;
};

// 회원 Mock 데이터
export const MEMBER: MemberEntity[] = [
    {
        id: 101,
        nickname: "냥냥이",
        profileImage: null,
    },
    {
        id: 102,
        nickname: "몽몽이",
        profileImage: null,
    },
    {
        id: 103,
        nickname: "꿀꿀이",
        profileImage: null,
    },
    {
        id: 104,
        nickname: "음멩이",
        profileImage: null,
    },
];

export const MEMBER_NICKNAME: Record<number, string> = MEMBER.reduce(
    (acc, cur) => {
        acc[cur.id] = cur.nickname;
        return acc;
    },
    {} as Record<number, string>
);
