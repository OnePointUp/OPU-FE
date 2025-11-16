"use client";

import OpuCard from "@/features/opu/components/OpuCard";
import type { OpuCardModel } from "@/features/opu/domain";

type Props = {
    items: OpuCardModel[];
    onMore?: (id: number) => void;
    loading?: boolean;
};

export default function LikedOpuList({
    items,
    onMore,
    loading = false,
}: Props) {
    const cardList = loading
        ? Array.from({ length: 4 }).map((_, idx) => ({
              id: idx,
              title: "",
              emoji: "",
              categoryId: 0,
              periodLabel: "",
              liked: false,
          }))
        : items;

    return (
        <div className="flex flex-wrap gap-2 px-1">
            {cardList.map((item) => (
                <div key={item.id} className="w-[calc(50%-4px)]">
                    <OpuCard item={item} onMore={onMore} loading={loading} />
                </div>
            ))}

            {!loading && items.length === 0 && (
                <div className="text-center text-sm py-10 w-full">
                    찜한 OPU가 없습니다
                </div>
            )}
        </div>
    );
}
