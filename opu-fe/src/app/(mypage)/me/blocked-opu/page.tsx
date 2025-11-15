import Header from "@/components/layout/Header";
import BlockedOpuManagePage from "@/features/blocked-opu/pages/BlockedOpuManagePage";
import { getBlockedOpuList } from "@/features/blocked-opu/services";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";

export default async function Page() {
    const items = await getBlockedOpuList(CURRENT_MEMBER_ID);

    return (
        <div className="app-page">
            <Header
                title="차단 OPU 관리"
                tooltip={{
                    message: [
                        "차단을 해제한 OPU는 랜덤 뽑기 시",
                        "다시 나타날 수 있으니 참고하시기 바랍니다.",
                    ],
                    position: "bottom",
                }}
            />
            <BlockedOpuManagePage initialItems={items} />
        </div>
    );
}
