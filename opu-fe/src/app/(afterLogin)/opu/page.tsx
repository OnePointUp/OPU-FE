import MyOpuPage from "@/features/opu/pages/MyOpuPage";
import { fetchMyOpuCards } from "@/features/opu/service";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default async function Page() {
    const items = await fetchMyOpuCards(CURRENT_MEMBER_ID);

    return <MyOpuPage items={items} />;
}
