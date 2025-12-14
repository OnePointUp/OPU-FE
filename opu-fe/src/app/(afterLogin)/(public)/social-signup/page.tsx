import { Suspense } from "react";
import SocialSignupPage from "@/features/auth/pages/SocialSignupPage";
export default function Page() {
    return (
        <Suspense fallback={null}>
            <SocialSignupPage />
        </Suspense>
    );
}
