"use client";

import { useRouter } from "next/navigation";
import RoutineListItem from "../components/RoutineListItem";
import { getRoutineStatus } from "../domain";
import { useRoutineList } from "../hooks/useRoutineList";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function RoutineListPage() {
    const router = useRouter();
    const { items, loading } = useRoutineList();
    const [onlyOngoing, setOnlyOngoing] = useState(true);

    const filtered = items.filter((it) => {
        const status = getRoutineStatus(it);
        if (onlyOngoing) return status === "ONGOING";
        return true;
    });

    return (
        <div className="flex flex-col bg-white">
            {/* 진행중인 루틴 필터 */}
            <div className="py-3 border-b border-[var(--color-super-light-gray)]">
                <label
                    className="inline-flex items-center gap-2"
                    style={{
                        color: "var(--color-dark-navy)",
                        fontSize: "var(--text-caption)",
                    }}
                >
                    <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={onlyOngoing}
                        onChange={(e) => setOnlyOngoing(e.target.checked)}
                    />
                    <span>진행중인 루틴</span>
                </label>
            </div>

            <main className="flex-1">
                {loading ? (
                    <div className="px-4 py-4 text-sm text-gray-400">
                        루틴 불러오는 중...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-gray-400">
                        표시할 루틴이 없어요
                    </div>
                ) : (
                    <div>
                        {filtered.map((item) => (
                            <RoutineListItem
                                key={item.id}
                                item={item}
                                onClick={
                                    (id) => router.push(`/routine/${id}`) // 추후 상세 페이지 만들면 수정
                                }
                            />
                        ))}
                    </div>
                )}
            </main>

            <div className="flex items-center justify-center py-8">
                <button
                    type="button"
                    aria-label="루틴 추가"
                    className="flex items-center justify-center"
                    onClick={() => router.push("/routine/register")}
                >
                    <Icon icon="ic:baseline-plus" width="30" height="30" />
                </button>
            </div>
        </div>
    );
}
