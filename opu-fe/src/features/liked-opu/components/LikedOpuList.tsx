"use client";

import OpuCard from "@/features/opu/components/OpuCard";
import type { OpuCardModel } from "@/features/opu/domain";

type Props = {
    items: OpuCardModel[];
    onMore?: (id: number) => void;
};

export default function LikedOpuList({ items, onMore }: Props) {
    return (
        <div className="flex flex-col gap-3 px-2">
            {items.map((item) => (
                <OpuCard
                    key={item.id}
                    item={item}
                    onAddTodo={(id) => console.log("투두 추가", id)}
                    onMore={onMore}
                />
            ))}

            {items.length === 0 && (
                <div
                    className="text-center text-sm py-10"
                    style={{
                        fontSize: "var(--text-sub)",
                        color: "var(--color-light-gray)",
                    }}
                >
                    찜한 OPU가 없습니다
                </div>
            )}
        </div>
    );
}
