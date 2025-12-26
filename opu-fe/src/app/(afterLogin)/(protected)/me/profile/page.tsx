import { Suspense } from "react";
import ProfileEditPage from "@/features/member/pages/ProfileEditPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ProfileEditPage />
        </Suspense>
    );
}
