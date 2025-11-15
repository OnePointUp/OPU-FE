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
    if (loading) {
        return (
            <div className="flex flex-col gap-3 px-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <OpuCard
                        key={`skeleton-${idx}`}
                        item={{
                            id: idx,
                            title: "",
                            emoji: "",
                            categoryId: 0,
                            periodLabel: "",
                            liked: false,
                        }}
                        loading
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 px-2">
            {items.map((item) => (
                <OpuCard key={item.id} item={item} onMore={onMore} />
            ))}

            {items.length === 0 && (
                <div className="text-center text-sm py-10">
                    찜한 OPU가 없습니다
                </div>
            )}
        </div>
    );
}
