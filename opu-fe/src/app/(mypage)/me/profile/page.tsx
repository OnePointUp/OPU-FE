import Header from "@/components/layout/Header";
import ProfileEditPage from "@/features/user/pages/ProfileEditPage";

export default function Page() {
    return (
        <div className="app-page">
            <Header title="프로필 편집" />
            <ProfileEditPage />
        </div>
    );
}
