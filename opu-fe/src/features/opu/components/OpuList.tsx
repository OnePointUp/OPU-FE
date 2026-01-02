"use client";

import OpuCard from "@/features/opu/components/OpuCard";
import type { OpuCardModel } from "@/features/opu/domain";

type Props = {
    items: OpuCardModel[];
    onMore?: (id: number) => void;
    onToggleFavorite?: (id: number) => Promise<void> | void;
    loading?: boolean;
    contextType?: "shared" | "my" | "liked";
};

export default function SharedOpuList({
    items,
    onMore,
    onToggleFavorite,
    loading = false,
    contextType,
}: Props) {
    const mode: NonNullable<Props["contextType"]> =
        contextType ?? "shared";

    if (loading) {
        const skeletons = Array.from({ length: 6 }).map((_, idx) => ({
            id: -idx - 1,
            title: "",
            emoji: "",
            categoryId: 0,
            timeLabel: "",
            isLiked: false,
        }));

        const left: OpuCardModel[] = [];
        const right: OpuCardModel[] = [];

        skeletons.forEach((item, idx) => {
            if (idx % 2 === 0) left.push(item);
            else right.push(item);
        });

        return (
            <div className="flex gap-2 px-1">
                <div className="flex-1 flex flex-col gap-2">
                    {left.map((item) => (
                        <OpuCard
                            key={item.id}
                            item={item}
                            onMore={onMore}
                            onToggleFavorite={onToggleFavorite}
                            loading
                        />
                    ))}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {right.map((item) => (
                        <OpuCard
                            key={item.id}
                            item={item}
                            onMore={onMore}
                            onToggleFavorite={onToggleFavorite}
                            loading
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        const { title, subtitle } =
            mode === "my"
                ? {
                      title: "내가 만든 OPU가 없습니다.",
                      subtitle: "하단 + 버튼으로 새로운 OPU를 만들어보세요.",
                  }
                : mode === "liked"
                ? {
                      title: "찜한 OPU가 없습니다.",
                      subtitle: "마음에 드는 OPU를 찜해보세요.",
                  }
                : {
                      title: "공유된 OPU가 없습니다.",
                      subtitle: "하단 + 버튼으로 새로운 OPU를 만들어보세요.",
                  };

        return (
            <div
                className="text-center py-10 w-full flex flex-col items-center gap-2"
                style={{
                    fontSize: "var(--text-sub)",
                    color: "var(--color-light-gray)",
                }}
            >
                <p style={{ color: "var(--color-dark-gray)" }}>{title}</p>
                <p className="text-[var(--color-light-gray)] text-xs">
                    {subtitle}
                </p>
            </div>
        );
    }

    const left: OpuCardModel[] = [];
    const right: OpuCardModel[] = [];

    items.forEach((item, idx) => {
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
                        onToggleFavorite={onToggleFavorite}
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
                        onToggleFavorite={onToggleFavorite}
                        loading={loading && item.id < 0}
                    />
                ))}
            </div>
        </div>
    );
}
