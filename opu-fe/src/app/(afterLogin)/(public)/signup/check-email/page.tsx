import { Suspense } from "react";
import SignupCheckEmailPage from "@/features/auth/pages/SignupCheckEmailPage";
export default function Page() {
    return (
        <Suspense fallback={null}>
            <SignupCheckEmailPage />
        </Suspense>
    );
}
