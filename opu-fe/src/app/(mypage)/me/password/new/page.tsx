import Header from "@/components/layout/Header";
import PasswordChangePage from "@/features/user/pages/SetNewPasswordPage";

export default function Page() {
    return (
        <div className="app-page">
            <Header title="비밀번호 변경" />
            <PasswordChangePage />
        </div>
    );
}
