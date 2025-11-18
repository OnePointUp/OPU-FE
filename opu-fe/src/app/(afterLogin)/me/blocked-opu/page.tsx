import BlockedOpuManagePage from "@/features/blocked-opu/pages/BlockedOpuManagePage";
import { getBlockedOpuList } from "@/features/blocked-opu/services";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default async function Page() {
    const items = await getBlockedOpuList(CURRENT_MEMBER_ID);

    return <BlockedOpuManagePage initialItems={items} />;
}
