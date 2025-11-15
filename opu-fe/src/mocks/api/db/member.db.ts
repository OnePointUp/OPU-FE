export type MemberEntity = {
    id: number;
    nickname: string;
    profileImage?: string | null;
};

export const MEMBER: MemberEntity[] = [
    { id: 101, nickname: "냥냥이", profileImage: null },
    { id: 102, nickname: "몽몽이", profileImage: null },
    { id: 103, nickname: "꿀꿀이", profileImage: null },
    { id: 104, nickname: "음멩이", profileImage: null },
];

// 현재 로그인된 유저 (mock)
export const CURRENT_MEMBER_ID = 101;

export const MEMBER_NICKNAME: Record<number, string> = MEMBER.reduce(
    (acc, cur) => {
        acc[cur.id] = cur.nickname;
        return acc;
    },
    {} as Record<number, string>
);
