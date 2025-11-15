import Header from "@/components/layout/Header";
import LikedOpuPage from "@/features/liked-opu/pages/LikedOpuPage";
import { getLikedOpuList } from "@/features/liked-opu/services";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default async function Page() {
    const items = await getLikedOpuList(CURRENT_MEMBER_ID);

    return (
        <div>
            <Header title="찜" />
            <LikedOpuPage items={items} />
        </div>
    );
}
