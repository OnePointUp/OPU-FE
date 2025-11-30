export type Tooltip = {
    message: string | string[];
    position?: "top" | "bottom" | "right";
};

export const TITLE_MAP: Record<string, string> = {
    "/": "홈",
    "/login": "로그인",

    "/social-signup": "회원가입",
    "/signup": "회원가입",
    "/signup/check-email": "회원가입",
    "/signup/email-confirmed": "회원가입",

    "/me": "마이페이지",
    "/me/profile": "프로필 편집",
    "/me/password": "비밀번호 변경",

    "/opu": "OPU",
    "/opu/my": "내 OPU",
    "/opu/blocked": "차단 OPU 관리",
    "/opu/liked": "찜한 OPU",
    "/opu/register": "OPU 등록",
    "/opu/random/scope": "랜덤 뽑기",
    "/opu/random/time": "랜덤 뽑기",
    "/opu/random/result": "오늘의 랜덤 OPU",

    "/notification": "알림",
    "/notification/setting": "알림 설정",

    "/routine": "루틴",
    "/routine/register": "루틴 설정",

    "/calendar": "캘린더",
    "/stats": "통계",
};

export const TOOLTIP_MAP: Record<string, Tooltip> = {
    "/opu/blocked": {
        message: [
            "차단을 해제한 OPU는 랜덤 뽑기 시",
            "다시 나타날 수 있으니 참고하시기 바랍니다.",
        ],
        position: "bottom",
    },
};

export const HIDDEN_HEADER_PATHS = ["/signup/email-confirmed"];

const ROOT_PATHS = ["/", "/opu", "/me", "/calendar", "/stats"];

export function getHeaderConfig(pathname: string) {
    // 동적 경로
    let dynamicTitle: string | undefined;

    if (pathname.startsWith("/opu/edit/")) {
        dynamicTitle = "OPU 수정";
    } else if (pathname.startsWith("/routine/edit/")) {
        dynamicTitle = "루틴 수정";
    }

    const title = dynamicTitle ?? TITLE_MAP[pathname] ?? "OPU";
    const tooltip = TOOLTIP_MAP[pathname];
    const hide = HIDDEN_HEADER_PATHS.includes(pathname);
    const defaultShowBack = !ROOT_PATHS.includes(pathname);

    return {
        title,
        tooltip,
        hide,
        defaultShowBack,
    };
}
