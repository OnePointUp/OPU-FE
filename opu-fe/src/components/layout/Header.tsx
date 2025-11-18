"use client";

import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useState } from "react";

const TITLE_MAP: Record<string, string> = {
    "/": "홈",
    "/login": "로그인",
    "/opu": "OPU",
    "/me": "마이페이지",
    "/me/blocked-opu": "차단 OPU 관리",
    "/me/liked-opu": "찜",
    "/me/profile": "프로필 편집",
    "/me/password": "비밀번호 변경",
    "/calendar": "캘린더",
    "/stats": "통계",
    "/social-signup": "회원가입",
    "/signup": "회원가입",
    "/signup/check-email": "회원가입",
    "/signup/email-confirmed": "회원가입",
};

// 라우트별 기본 툴팁
const TOOLTIP_MAP: Record<string, Tooltip> = {
    "/me/blocked-opu": {
        message: [
            "차단을 해제한 OPU는 랜덤 뽑기 시",
            "다시 나타날 수 있으니 참고하시기 바랍니다.",
        ],
        position: "bottom",
    },
};

type Tooltip = {
    message: string | string[];
    position?: "top" | "bottom" | "right";
};

type Props = {
    // 필요하면 override 용으로만 씀 (안 넘겨도 됨)
    titleOverride?: string;
    show?: boolean;
    showBack?: boolean;
    onBack?: () => void;
    tooltipOverride?: Tooltip;
};

export default function Header({
    titleOverride,
    show = true,
    showBack,
    onBack,
    tooltipOverride,
}: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const HIDDEN_HEADER_PATHS = ["/signup/email-confirmed"];

    const hideByPath = HIDDEN_HEADER_PATHS.includes(pathname);

    if (!show || hideByPath) return null;

    const routeTitle = TITLE_MAP[pathname] ?? "OPU"; // 기본 타이틀: URL 기반
    const title = titleOverride ?? routeTitle; // 필요하면 props로 덮어쓸 수 있게

    // 툴팁도 라우트 기반 + override 가능
    const routeTooltip = TOOLTIP_MAP[pathname];
    const tooltip = tooltipOverride ?? routeTooltip;

    // 뒤로가기 기본값: 홈/메인에서는 안 보이게 하고 싶으면 여기서 처리
    const isRoot =
        pathname === "/opu" ||
        pathname === "/me" ||
        pathname === "/calendar" ||
        pathname === "/stats";

    const backVisible = showBack ?? !isRoot;

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {backVisible ? (
                    <button
                        className="app-header__back"
                        aria-label="뒤로가기"
                        onClick={onBack ?? (() => router.back())}
                    >
                        <Icon
                            icon="ic:round-arrow-back-ios-new"
                            width="22"
                            height="22"
                        />
                    </button>
                ) : (
                    <span className="app-header__spacer" />
                )}

                {/* 제목 + 툴팁 */}
                <div className="flex items-center justify-center gap-1 relative">
                    <h1 className="app-header__title">{title}</h1>

                    {tooltip && (
                        <div
                            className="relative group"
                            onMouseEnter={() => setVisible(true)}
                            onMouseLeave={() => setVisible(false)}
                        >
                            <Icon
                                icon="lucide:info"
                                width={16}
                                height={16}
                                style={{
                                    color: "var(--color-light-gray)",
                                    cursor: "pointer",
                                }}
                            />

                            {visible && (
                                <div
                                    className={`absolute z-50 text-center border border-[var(--color-light-gray)] 
                                               bg-[var(--background)] text-[11px] text-[var(--color-dark-gray)] 
                                               rounded-md px-3 py-2 shadow-sm
                                               ${
                                                   tooltip.position === "top"
                                                       ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
                                                       : tooltip.position ===
                                                         "right"
                                                       ? "left-full ml-2 top-1/2 -translate-y-1/2"
                                                       : "top-full mt-2 left-1/2 -translate-x-1/2"
                                               }`}
                                    style={{
                                        width: "max-content",
                                        maxWidth: "calc(100vw - 32px)",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "keep-all",
                                    }}
                                >
                                    {Array.isArray(tooltip.message)
                                        ? tooltip.message.join("\n")
                                        : tooltip.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <span className="app-header__spacer" />
            </div>
        </header>
    );
}
