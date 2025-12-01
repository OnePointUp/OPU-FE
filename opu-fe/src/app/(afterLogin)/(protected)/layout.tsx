import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        redirect("/login");
    }

    return <>{children}</>;
}
