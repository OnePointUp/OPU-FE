import Header from "@/components/layout/Header";
import VerifyCurrentPasswordPage from "@/features/user/pages/VerifyCurrentPasswordPage";

export default function PasswordStep1() {
    return (
        <div className="app-page">
            <Header title="비밀번호 변경" />
            <VerifyCurrentPasswordPage />
        </div>
    );
}
