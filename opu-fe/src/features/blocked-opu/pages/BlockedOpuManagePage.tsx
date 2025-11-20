"use client";

import BlockedOpuList from "@/features/blocked-opu/components/BlockedOpuList";
import { OpuCardModel } from "@/features/opu/domain";

type Props = {
    initialItems: OpuCardModel[];
};

export default function BlockedOpuManagePage({ initialItems }: Props) {
    return (
        <section className="px-2">
            <BlockedOpuList initialItems={initialItems} />
        </section>
    );
}
