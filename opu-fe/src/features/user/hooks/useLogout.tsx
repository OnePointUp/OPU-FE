import { logout } from "@/features/auth/services";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return { handleLogout };
}
