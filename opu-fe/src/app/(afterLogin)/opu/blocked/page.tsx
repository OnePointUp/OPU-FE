import BlockedOpuManagePage from "@/features/blocked-opu/pages/BlockedOpuManagePage";
import { getBlockedOpuList } from "@/features/blocked-opu/services";

export default async function Page() {
    const items = await getBlockedOpuList();

    return <BlockedOpuManagePage initialItems={items} />;
}
