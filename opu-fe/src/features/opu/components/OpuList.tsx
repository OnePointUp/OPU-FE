"use client";

import OpuCard from "@/features/opu/components/OpuCard";
import type { OpuCardModel } from "@/features/opu/domain";

type Props = {
    items: OpuCardModel[];
    onMore?: (id: number) => void;
    loading?: boolean;
    contextType?: "shared" | "my" | "liked";
};

export default function SharedOpuList({
    items,
    onMore,
    loading = false,
    contextType,
}: Props) {
    const cardList: OpuCardModel[] = loading
        ? Array.from({ length: 6 }).map((_, idx) => ({
              id: -idx - 1,
              title: "",
              emoji: "",
              categoryId: 0,
              timeLabel: "",
              isLiked: false,
          }))
        : items;

    if (!loading && items.length === 0) {
        const emptyMessage =
            contextType === "my" ? (
                <>
                    내가 만든 OPU가 없습니다.
                    <br />
                    OPU를 등록해보세요!
                </>
            ) : (
                <>공유된 OPU가 없습니다.</>
            );

        return (
            <div
                className="text-center py-10 w-full"
                style={{
                    fontSize: "var(--text-sub)",
                    color: "var(--color-light-gray)",
                }}
            >
                {emptyMessage}
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
