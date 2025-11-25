"use client";

import { useRouter } from "next/navigation";
import RoutineListItem from "../components/RoutineListItem";
import { getRoutineStatus } from "../domain";
import { useRoutineList } from "../hooks/useRoutineList";
import { useCallback, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import BottomSheet from "@/components/common/BottomSheet";
import ActionList, { type ActionItem } from "@/components/common/ActionList";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function RoutineListPage() {
    const router = useRouter();
    const { items, loading } = useRoutineList();
    const [onlyOngoing, setOnlyOngoing] = useState(false);

    const [openSheet, setOpenSheet] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const filtered = useMemo(
        () =>
            items.filter((it) => {
                const status = getRoutineStatus(it);
                if (onlyOngoing) return status === "ONGOING";
                return true;
            }),
        [items, onlyOngoing]
    );

    const onClickItem = useCallback((id: number) => {
        setSelectedId(id);
        setOpenSheet(true);
    }, []);

    const onCloseSheet = () => {
        setOpenSheet(false);
        setSelectedId(null);
    };

    const actionItems: ActionItem[] = useMemo(
        () => [
            {
                label: "수정",
                onClick: () => {
                    if (!selectedId) return;
                    router.push(`/routine/edit/${selectedId}`);
                    onCloseSheet();
                },
            },
            {
                label: "삭제",
                danger: true,
                onClick: () => {
                    if (!selectedId) return;
                    setConfirmOpen(true);
                    onCloseSheet();
                },
            },
        ],
        [router, selectedId]
    );

    return (
        <section>
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
                                onClick={onClickItem}
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

            <BottomSheet open={openSheet} onClose={onCloseSheet}>
                <ActionList items={actionItems} />
            </BottomSheet>

            <ConfirmModal
                isOpen={confirmOpen}
                message={"정말 삭제하시겠습니까?"}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => {
                    if (!selectedId) return;

                    // TODO: 삭제 API 자리
                    // await deleteRoutine(selectedId);

                    setConfirmOpen(false);
                }}
            />
        </section>
    );
}
