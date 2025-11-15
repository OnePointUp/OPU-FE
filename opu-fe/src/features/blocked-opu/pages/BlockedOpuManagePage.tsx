"use client";

import BlockedOpuList from "@/features/blocked-opu/components/BlockedOpuList";
import { OpuCardModel } from "@/features/opu/domain";

type Props = {
    initialItems: OpuCardModel[];
};

export default function BlockedOpuManagePage({ initialItems }: Props) {
    return (
        <div className="app-container pt-app-header pb-40">
            <BlockedOpuList initialItems={initialItems} />
        </div>
    );
}
