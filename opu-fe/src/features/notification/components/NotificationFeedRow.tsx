"use client";

import type { NotificationFeedItem } from "../types";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { Icon } from "@iconify/react";

type Props = {
    item: NotificationFeedItem;
    onClick: (item: NotificationFeedItem) => void;
};

const ICON_MAP: Record<NotificationFeedItem["code"], string> = {
    MORNING: "twemoji:sun",
    EVENING: "fxemoji:crescentmoon",
    ROUTINE: "devicon:cosmosdb",
    TODO: "catppuccin:todo",
    RANDOM_DRAW: "fluent-emoji-flat:magic-wand",
};

export default function NotificationFeedRow({ item, onClick }: Props) {
    const isDimmed = item.read;
    const icon = ICON_MAP[item.code];

    return (
        <li
            onClick={() => onClick(item)}
            className="cursor-pointer flex gap-4 py-3 cursor-pointer"
            style={{
                background: "var(--color-background)",
                opacity: isDimmed ? 0.5 : 1,
            }}
        >
            <div className="flex w-12 h-12 mt-2 items-center justify-center bg-[var(--color-super-light-pink)] rounded-full">
                <Icon
                    icon={icon}
                    width={23}
                    height={23}
                    style={{
                        color: "var(--color-dark-gray)",
                    }}
                />
            </div>

            <div className="flex flex-1 flex-col">
                <p
                    style={{
                        fontSize: "var(--text-sub)",
                        fontWeight: "var(--weight-medium)",
                        lineHeight: "18px",
                        color: "var(--color-dark-navy)",
                    }}
                >
                    {item.title}
                </p>

                {item.message && (
                    <p
                        className="mt-1"
                        style={{
                            fontSize: "var(--text-caption)",
                            lineHeight: "18px",
                            color: "var(--color-dark-gray)",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {item.message}
                    </p>
                )}

                <span
                    className="mt-1"
                    style={{
                        fontSize: "var(--text-caption)",
                        color: "var(--color-light-gray)",
                    }}
                >
                    {formatTimeAgo(item.createdAt)}
                </span>
            </div>
        </li>
    );
}
