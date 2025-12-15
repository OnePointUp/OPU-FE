import { Suspense } from "react";
import EmailFailedPage from "@/features/auth/pages/EmailFailedPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <EmailFailedPage />
        </Suspense>
    );
}
