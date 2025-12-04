"use client";

import { Icon } from "@iconify/react";
import { CATEGORY_BADGE } from "@/features/opu/domain";
import { type OpuCardModel } from "@/features/opu/domain";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";
import Badge from "@/components/common/Badge";

export default function OpuRankingCard({
    item,
    onMore,
}: {
    item: OpuCardModel;
    onMore?: (id: number) => void;
    selectable?: boolean;
    checked?: boolean;
    onCheckedChange?: (id: number, next: boolean) => void;
}) {
    const categoryKey = item.categoryName ?? "기타";
    const { bg, text } = CATEGORY_BADGE[categoryKey] ?? CATEGORY_BADGE["기타"];

    return (
        <div className="cursor-pointer rounded-xl border border-[var(--color-super-light-gray)] p-2">
            <div className="w-full flex items-center justify-between gap-4">
                <div className="flex items-center justify-center p-1 bg-[var(--color-opu-yellow)] rounded-2xl mt-0.5">
                    <span
                        className="flex items-center justify-center shrink-0"
                        style={{
                            fontSize: "var(--text-h2)",
                            width: 35,
                            height: 35,
                        }}
                    >
                        {item.emoji ?? "❓"}
                    </span>
                </div>

                <div className="w-full flex flex-col">
                    <div className="flex items-start justify-between">
                        <p
                            style={{
                                fontSize: "var(--text-sub)",
                                fontWeight: "var(--weight-semibold)",
                            }}
                        >
                            {item.title}
                        </p>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                            <Badge label={categoryKey} bg={bg} color={text} />
                            <Badge
                                label={item.timeLabel}
                                bg="#F3F3F3"
                                color="#959595"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full flex items-center justify-end gap-0.5 mr-2">
                    <span
                        style={{
                            fontSize: "var(--text-caption)",
                            fontWeight: "var(--weight-regular)",
                            color: "var(--color-dark-navy)",
                        }}
                    >
                        {item.completedCount ?? 0}회 완료
                    </span>
                    <Icon
                        icon="lets-icons:check-fill"
                        width={15}
                        height={15}
                        style={{ color: "var(--color-opu-green)" }}
                    />
                </div>
            </div>
        </div>
    );
}
