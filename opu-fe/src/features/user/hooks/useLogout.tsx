import { logout } from "@/features/auth/services";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace("/login");
        } catch (error) {
            console.error("로그아웃 처리 중 오류 발생:", error);
            router.replace("/login");
        }
    };
    return { handleLogout };
}
