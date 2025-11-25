export type MemberEntity = {
    id: number;
    nickname: string;
    email: string;
    bio: string;
    profileImage?: string | null;
};

export const MEMBER: MemberEntity[] = [
    {
        id: 101,
        nickname: "냥냥이",
        email: "nyang101@example.com",
        bio: "하루 한 걸음씩 성장 중입니다 🌿",
        profileImage: null,
    },
    {
        id: 102,
        nickname: "몽몽이",
        email: "mong102@example.com",
        bio: "오늘도 기분 좋게 시작!",
        profileImage: null,
    },
    {
        id: 103,
        nickname: "꿀꿀이",
        email: "ggul103@example.com",
        bio: "소소한 루틴을 지키는 중이에요 🐷",
        profileImage: null,
    },
    {
        id: 104,
        nickname: "음멩이",
        email: "eumm104@example.com",
        bio: "차분히 하루 정리하기",
        profileImage: null,
    },
    {
        id: 105,
        nickname: "곰도리",
        email: "gom105@example.com",
        bio: "포근한 하루 만들기 🍯",
        profileImage: null,
    },
    {
        id: 106,
        nickname: "펭귄씨",
        email: "peng106@example.com",
        bio: "조용히 꾸준히 🐧",
        profileImage: null,
    },
    {
        id: 107,
        nickname: "너굴너굴",
        email: "rac107@example.com",
        bio: "작은 습관부터 시작!",
        profileImage: null,
    },
    {
        id: 108,
        nickname: "호랭군",
        email: "horang108@example.com",
        bio: "오늘도 집중!",
        profileImage: null,
    },
    {
        id: 109,
        nickname: "폭주기니",
        email: "gp109@example.com",
        bio: "부드럽게, 때론 빠르게 🐹",
        profileImage: null,
    },
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
