import Header from "@/components/layout/Header";
import BlockedOpuList from "@/features/blocked-opu/components/BlockedOpuList";
import { getBlockedOpuList } from "@/features/blocked-opu/services";
import { mockUser } from "@/mocks/api/handler/user";

export default async function Page() {
    const items = await getBlockedOpuList(mockUser.id);

    return (
        <div className="app-page overflow-hidde">
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
            <div className="app-container pt-app-header pb-40">
                <BlockedOpuList initialItems={items} />
            </div>
        </div>
    );
}
