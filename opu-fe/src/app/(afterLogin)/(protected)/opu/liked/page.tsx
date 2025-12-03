import OpuListPage from "@/features/opu/pages/OpuListPage";

export default async function Page() {
    return <OpuListPage contextType="liked" showLikedFilter={false} />;
}
