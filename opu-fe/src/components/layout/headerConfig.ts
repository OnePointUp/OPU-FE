import { ReadonlyURLSearchParams } from "next/navigation";

export type Tooltip = {
    message: string | string[];
    position?: "top" | "bottom" | "right";
};

/* ====== 공통 prefix 묶어서 계층 구조로 정리 ====== */
const TITLE_GROUP = {
    signup: {
        base: "회원가입",
        map: {
            "/signup": "회원가입",
            "/signup/check-email": "회원가입",
            "/signup/email-confirmed": "회원가입",
            "/signup/email-failed": "회원가입",
        },
    },
    socialSignup: {
        base: "소셜 회원가입",
        map: {
            "/social-signup": "추가 정보 입력",
        },
    },
    findPw: {
        base: "비밀번호 찾기",
        map: {
            "/find-pw": "비밀번호 찾기",
            "/find-pw/email-confirmed": "비밀번호 찾기",
        },
    },
    me: {
        base: "마이페이지",
        map: {
            "/me": "마이페이지",
            "/me/profile": "프로필 편집",
            "/me/verify-password": "비밀번호 확인",
        },
    },
    opu: {
        base: "OPU",
        map: {
            "/opu": "OPU",
            "/opu/my": "내 OPU",
            "/opu/blocked": "차단 OPU 관리",
            "/opu/liked": "찜한 OPU",
            "/opu/register": "OPU 등록",
            "/opu/random/scope": "랜덤 뽑기",
            "/opu/random/time": "랜덤 뽑기",
            "/opu/random/result": "오늘의 랜덤 OPU",
        },
    },
    notification: {
        base: "알림",
        map: {
            "/notification": "알림",
            "/notification/setting": "알림 설정",
        },
    },
    routine: {
        base: "루틴",
        map: {
            "/routine": "루틴",
            "/routine/register": "루틴 설정",
        },
    },
};

/* ====== 단일 맵으로 풀어서 통합 TITLE_MAP 생성 ====== */
const TITLE_MAP: Record<string, string> = {
    "/": "홈",
    "/login": "로그인",
    "/calendar": "캘린더",
    "/stats": "통계",

    ...TITLE_GROUP.signup.map,
    ...TITLE_GROUP.socialSignup.map,
    ...TITLE_GROUP.findPw.map,
    ...TITLE_GROUP.me.map,
    ...TITLE_GROUP.opu.map,
    ...TITLE_GROUP.notification.map,
    ...TITLE_GROUP.routine.map,
};

/* ====== Tooltip, 숨김 경로, 루트 경로 ====== */
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

/* ====== header config 생성 함수 ====== */
export function getHeaderConfig(
    pathname: string,
    searchParams?: ReadonlyURLSearchParams
) {
    let dynamicTitle: string | undefined;

    if (pathname.startsWith("/opu/edit/")) {
        dynamicTitle = "OPU 수정";
    } else if (pathname.startsWith("/routine/edit/")) {
        dynamicTitle = "루틴 수정";
    } else if (pathname.startsWith("/reset-password")) {
        const token = searchParams?.get("token");
        dynamicTitle = token ? "비밀번호 재설정" : "비밀번호 변경";
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
