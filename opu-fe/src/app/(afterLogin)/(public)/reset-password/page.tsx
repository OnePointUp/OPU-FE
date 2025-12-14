import { Suspense } from "react";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordPage />
        </Suspense>
    );
}
