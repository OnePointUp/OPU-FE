import { useLogout } from "../hooks/useLogout";

export function useMyPageMenuData() {
    const { handleLogout } = useLogout();

    const myPageMenuItems = [
        { label: "차단 OPU 관리", href: "/opu/blocked" },
        { label: "알림 설정", href: "/notification/setting" },
        { label: "비밀번호 변경", href: "/me/password" },
        { label: "로그아웃", onClick: handleLogout },
    ];

    return { myPageMenuItems };
}
