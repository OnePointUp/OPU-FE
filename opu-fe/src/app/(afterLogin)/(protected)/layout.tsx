import PushBootstrap from "@/features/notification/components/PushBootstrap";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const AUTH_COOKIE_NAME = "opu_session";

export default async function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!session) {
        redirect("/welcome");
    }

    return (
        <>
            <PushBootstrap />
            {children}
        </>
    );
}
