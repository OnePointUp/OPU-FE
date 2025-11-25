"use client";

import BlockedOpuList from "@/features/blocked-opu/components/BlockedOpuList";
import { OpuCardModel } from "@/features/opu/domain";

type Props = {
    initialItems: OpuCardModel[];
};

export default function BlockedOpuManagePage({ initialItems }: Props) {
    return (
        <section>
            <BlockedOpuList initialItems={initialItems} />
        </section>
    );
}
