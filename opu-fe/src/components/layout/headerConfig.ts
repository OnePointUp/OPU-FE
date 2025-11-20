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

    "/calendar": "캘린더",
    "/stats": "통계",
    "/notification": "알림",
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

export function getHeaderConfig(pathname: string) {
    if (pathname.startsWith("/opu/edit/")) {
        return {
            title: "OPU 수정",
            tooltip: undefined,
            hide: false,
            defaultShowBack: true,
        };
    }

    const title = TITLE_MAP[pathname] ?? "OPU";
    const tooltip = TOOLTIP_MAP[pathname];
    const hide = HIDDEN_HEADER_PATHS.includes(pathname);

    const isRoot =
        pathname === "/" ||
        pathname === "/opu" ||
        pathname === "/me" ||
        pathname === "/calendar" ||
        pathname === "/stats";

    const defaultShowBack = !isRoot;

    return {
        title,
        tooltip,
        hide,
        defaultShowBack,
    };
}
