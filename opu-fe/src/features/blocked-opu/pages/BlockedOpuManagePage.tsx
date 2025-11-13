"use client";

import Header from "@/components/layout/Header";
import BlockedOpuList from "@/features/blocked-opu/components/BlockedOpuList";
import type { OpuCardModel } from "@/types/opu";

type Props = {
    initialItems: OpuCardModel[];
};

export default function BlockedOpuManagePage({ initialItems }: Props) {
    return (
        <div className="app-page overflow-hidden">
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
                <BlockedOpuList initialItems={initialItems} />
            </div>
        </div>
    );
}
