"use client";

import OpuCard from "@/features/opu/components/OpuCard";
import type { OpuCardModel } from "@/features/opu/domain";

type Props = {
    items: OpuCardModel[];
    onMore?: (id: number) => void;
    loading?: boolean;
};

export default function MyOpuList({ items, onMore, loading = false }: Props) {
    const cardList: OpuCardModel[] = loading
        ? Array.from({ length: 4 }).map((_, idx) => ({
              id: -idx - 1,
              title: "",
              emoji: "",
              categoryId: 0,
              periodLabel: "",
              liked: false,
          }))
        : items;

    if (!loading && items.length === 0) {
        return (
            <div
                className="text-center py-10 w-full"
                style={{
                    fontSize: "var(--text-sub)",
                    color: "var(--color-light-gray)",
                }}
            >
                나의 OPU가 없습니다
            </div>
        );
    }

    const left: OpuCardModel[] = [];
    const right: OpuCardModel[] = [];

    cardList.forEach((item, idx) => {
        if (idx % 2 === 0) left.push(item);
        else right.push(item);
    });

    return (
        <div className="flex gap-2 px-1">
            {/* 왼쪽 컬럼 */}
            <div className="flex-1 flex flex-col gap-2">
                {left.map((item) => (
                    <OpuCard
                        key={item.id}
                        item={item}
                        onMore={onMore}
                        loading={loading && item.id < 0}
                    />
                ))}
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="flex-1 flex flex-col gap-2">
                {right.map((item) => (
                    <OpuCard
                        key={item.id}
                        item={item}
                        onMore={onMore}
                        loading={loading && item.id < 0}
                    />
                ))}
            </div>
        </div>
    );
}
