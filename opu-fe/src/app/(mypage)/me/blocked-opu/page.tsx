import BlockedOpuManagePage from "@/features/blocked-opu/pages/BlockedOpuManagePage";
import { getBlockedOpuList } from "@/features/blocked-opu/services";
import { mockUser } from "@/mocks/api/handler/user";

export default async function Page() {
    const items = await getBlockedOpuList(mockUser.id);

    return <BlockedOpuManagePage initialItems={items} />;
}
