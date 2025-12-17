"use client";

import { useRouter } from "next/navigation";
import { useNotificationFeed } from "../hooks/useNotificationFeed";
import NotificationFeedRow from "../components/NotificationFeedRow";
import NotificationFeedRowSkeleton from "../components/NotificationFeedRowSkeleton";
import type { NotificationCode, NotificationFeedItem } from "../types";

function sortByCreatedAt<T extends { createdAt: string }>(items: T[]): T[] {
    return [...items].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

function getDateKey(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatSectionLabel(date: Date) {
    const today = new Date();
    const todayKey = getDateKey(today);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = getDateKey(yesterday);

    const key = getDateKey(date);

    if (key === todayKey) return "오늘";
    if (key === yesterdayKey) return "어제";

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
}

function groupByDate<T extends { createdAt: string }>(items: T[]) {
    const map = new Map<string, { date: Date; items: T[] }>();

    items.forEach((item) => {
        const date = new Date(item.createdAt);
        const key = getDateKey(date);
        const entry = map.get(key);
        if (entry) {
            entry.items.push(item);
        } else {
            map.set(key, { date, items: [item] });
        }
    });

    // 최신 날짜 순으로 정렬
    return [...map.values()]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((g) => ({
            label: formatSectionLabel(g.date),
            items: sortByCreatedAt(g.items),
        }));
}

export default function NotificationListPage() {
    const { items, loading, markAllRead, markAsRead } = useNotificationFeed();
    const router = useRouter();

    const getRedirectPath = (code: NotificationCode) => {
        switch (code) {
            case "MORNING":
            case "EVENING":
            case "TODO":
            case "ROUTINE":
                return "/";
            case "RANDOM_DRAW":
                return "/opu/random/scope";
            default:
                return "/";
        }
    };

    const handleClickItem = (item: NotificationFeedItem) => {
        // 읽음 처리 + 리다이렉트
        markAsRead(item.id);
        router.push(getRedirectPath(item.code));
    };

    const groups = groupByDate(items);

    return (
        <section>
            <div className="flex justify-end -mt-2">
                <button
                    type="button"
                    className="underline underline-offset-[3px] decoration-[1px]"
                    style={{
                        fontSize: "var(--text-caption)",
                        color: "var(--color-light-gray)",
                    }}
                    onClick={markAllRead}
                >
                    모두 읽음
                </button>
            </div>

            {loading ? (
                <ul className="flex flex-col">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <NotificationFeedRowSkeleton key={i} />
                    ))}
                </ul>
            ) : groups.length === 0 ? (
                <div
                    className="text-center py-10 w-full"
                    style={{
                        fontSize: "var(--text-sub)",
                        color: "var(--color-light-gray)",
                    }}
                >
                    아직 알림이 없어요.
                </div>
            ) : (
                <div className="flex flex-col">
                    {groups.map((group) => (
                        <section key={group.label}>
                            <h2
                                className="pt-3"
                                style={{
                                    fontSize: "var(--text-caption)",
                                    color: "var(--color-dark-gray)",
                                }}
                            >
                                {group.label}
                            </h2>
                            <ul className="flex flex-col">
                                {group.items.map((item) => (
                                    <NotificationFeedRow
                                        key={item.id + item.createdAt}
                                        item={item}
                                        onClick={handleClickItem}
                                    />
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </section>
    );
}
