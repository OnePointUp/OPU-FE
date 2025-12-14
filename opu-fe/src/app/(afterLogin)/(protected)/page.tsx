import MainPage from "@/features/main/pages/MainPage";
import ProtectedPushGate from "@/features/notification/components/ProtectedPushGate";

export default function Page() {
    return (
        <>
            <ProtectedPushGate />
            <MainPage />
        </>
    );
}
