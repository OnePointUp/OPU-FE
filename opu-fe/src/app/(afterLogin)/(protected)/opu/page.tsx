import OpuListPage from "@/features/opu/pages/OpuListPage";
import { fetchSharedOpuCardsByMember } from "@/features/opu/service";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default async function Page() {
    const items = await fetchSharedOpuCardsByMember(CURRENT_MEMBER_ID);

    return <OpuListPage items={items} contextType="shared" />;
}
