"use client";

import type { NotificationFeedItem } from "../types";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { Icon } from "@iconify/react";

type Props = {
    item: NotificationFeedItem;
    onRead: (id: number) => void;
};

const ICON_MAP: Record<NotificationFeedItem["key"], string> = {
    morning: "twemoji:sun",
    evening: "fxemoji:crescentmoon",
    routine: "devicon:cosmosdb",
    todo: "catppuccin:todo",
    random: "fluent-emoji-flat:magic-wand",
};

export default function NotificationFeedRow({ item, onRead }: Props) {
    const isDimmed = item.isRead;
    const icon = ICON_MAP[item.key];

    return (
        <li
            onClick={() => onRead(item.id)}
            className="cursor-pointer flex gap-4 px-2 py-3"
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
