"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    type OpuCardModel,
    type OpuListFilterRequest,
    type OpuListPage,
    TIME_CODE_TO_MINUTES,
    type TimeCode,
    getSortLabel,
    type SortOption,
    getCategoryFilterLabel,
    getTimeFilterLabel,
    SORT_OPTION_TO_API_SORT,
} from "@/features/opu/domain";
import {
    fetchMyOpuList,
    fetchSharedOpuList,
    fetchLikedOpuList,
    addTodoByOpu,
    toggleOpuShare,
    deleteMyOpu,
} from "../service";
import { toastError, toastSuccess } from "@/lib/toast";
import { blockOpu } from "@/features/blocked-opu/services";

export type FilterMode = "time" | "category";

type Props = {
    contextType?: "my" | "shared" | "liked";
};

const PAGE_SIZE = 20;

export function useOpuListPage({ contextType = "shared" }: Props) {
    const router = useRouter();

    const [page, setPage] = useState(0);
    const [pageMeta, setPageMeta] =
        useState<
            Pick<
                OpuListPage,
                | "totalElements"
                | "totalPages"
                | "currentPage"
                | "pageSize"
                | "hasNext"
                | "hasPrevious"
            >
        >();

    const [data, setData] = useState<OpuCardModel[]>([]);
    const [loading, setLoading] = useState(true);

    const [q, setQ] = useState("");

    const [times, setTimes] = useState<TimeCode[]>([]);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);

    const [filterMode, setFilterMode] = useState<FilterMode>("time");
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [sheetId, setSheetId] = useState<number | null>(null);

    const [blockTargetId, setBlockTargetId] = useState<number | null>(null);

    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [sortOption, setSortOption] = useState<SortOption>("liked");
    const [showSortSheet, setShowSortSheet] = useState(false);

    const [onlyLiked, setOnlyLiked] = useState(false);

    const requestFilter: OpuListFilterRequest = useMemo(() => {
        const minutes =
            times.length === 0
                ? undefined
                : times
                      .filter((t): t is Exclude<TimeCode, "ALL"> => t !== "ALL")
                      .map((t) => TIME_CODE_TO_MINUTES[t])
                      .filter((v) => v != null);

        const sort = SORT_OPTION_TO_API_SORT[sortOption];

        return {
            categoryIds: categoryIds.length ? categoryIds : undefined,
            requiredMinutes: minutes && minutes.length ? minutes : undefined,
            search: q.trim() || undefined,
            favoriteOnly:
                contextType === "liked" ? undefined : onlyLiked || undefined,
            sort,
        };
    }, [q, times, categoryIds, onlyLiked, sortOption, contextType]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                const res =
                    contextType === "my"
                        ? await fetchMyOpuList({
                              page,
                              size: PAGE_SIZE,
                              filter: requestFilter,
                          })
                        : contextType === "liked"
                        ? await fetchLikedOpuList({
                              page,
                              size: PAGE_SIZE,
                              filter: requestFilter,
                          })
                        : await fetchSharedOpuList({
                              page,
                              size: PAGE_SIZE,
                              filter: requestFilter,
                          });

                if (cancelled) return;

                setData(res.content);
                setPageMeta({
                    totalElements: res.totalElements,
                    totalPages: res.totalPages,
                    currentPage: res.currentPage,
                    pageSize: res.pageSize,
                    hasNext: res.hasNext,
                    hasPrevious: res.hasPrevious,
                });
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    toastError("OPU 목록을 불러오지 못했어요.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [contextType, page, requestFilter]);

    const timeLabel = useMemo(() => getTimeFilterLabel(times), [times]);
    const categoryLabel = useMemo(
        () => getCategoryFilterLabel(categoryIds),
        [categoryIds]
    );
    const sortLabel = getSortLabel(sortOption);

    // 정렬 변경
    const handleChangeSort = (opt: SortOption) => {
        setSortOption(opt);
        setShowSortSheet(false);
        setPage(0);
    };

    // 시간 필터 토글
    const handleToggleTime = (value: TimeCode) => {
        if (value === "ALL") {
            setTimes([]);
            setPage(0);
            return;
        }

        setTimes((prev) => {
            const filtered = prev.filter((p) => p !== "ALL");
            if (filtered.includes(value)) {
                return filtered.filter((p) => p !== value);
            }
            return [...filtered, value];
        });
        setPage(0);
    };

    // 카테고리 필터 토글
    const handleToggleCategory = (id: number) => {
        if (id === -1) {
            setCategoryIds([]);
            setPage(0);
            return;
        }
        setCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
        setPage(0);
    };

    const handleResetFilter = () => {
        setTimes([]);
        setCategoryIds([]);
        setPage(0);
    };

    const handleOpenFilterTime = () => {
        setFilterMode("time");
        setFilterSheetOpen(true);
    };

    const handleOpenFilterCategory = () => {
        setFilterMode("category");
        setFilterSheetOpen(true);
    };

    // 더보기 시트
    const handleOpenMore = (id: number) => setSheetId(id);
    const handleCloseMore = () => setSheetId(null);

    const selectedItem =
        sheetId !== null ? data.find((i) => i.id === sheetId) : undefined;

    const isMine = selectedItem?.isMine ?? false;

    const handleEditSelected = () => {
        if (!selectedItem) return;
        router.push(`/opu/edit/${selectedItem.id}`);
    };

    // 차단하기
    const handleBlockSelected = async (opuId: number) => {
        try {
            await blockOpu(opuId);

            setData((prev) => prev.filter((item) => item.id !== opuId));

            toastSuccess("OPU를 차단했어요.");
            setSheetId(null);
        } catch (e) {
            console.error(e);
            toastError("OPU 차단을 실패했어요");
        }
    };

    // 투두리스트 추가
    const handleAddTodoSelected = async (opuId: number) => {
        try {
            await addTodoByOpu(opuId);
            toastSuccess("해당 OPU가 오늘 할 일에 추가됐어요");
        } catch (e) {
            console.error(e);
            toastError("투두리스트에 추가하지 못했어요.");
        }
    };

    // 공개/비공개 토글
    const handleShareToggle = async (
        opuId: number,
        isCurrentlyShared: boolean | undefined
    ) => {
        const prevShared = !!isCurrentlyShared;
        const nextShared = !prevShared;

        // UI 먼저 반영
        setData((prev) =>
            prev.map((item) =>
                item.id === opuId ? { ...item, isShared: nextShared } : item
            )
        );

        try {
            await toggleOpuShare(opuId, prevShared);
            toastSuccess(
                nextShared
                    ? "OPU가 공개로 전환되었습니다"
                    : "OPU가 비공개로 전환되었습니다"
            );
        } catch (err) {
            console.error(err);
            setData((prev) =>
                prev.map((item) =>
                    item.id === opuId ? { ...item, isShared: prevShared } : item
                )
            );
            toastError("OPU 공개 설정을 변경하지 못했어요");
        }
    };

    const handleDeleteSelected = async (opuId: number) => {
        if (deleteLoading) return;
        setDeleteLoading(true);

        try {
            await deleteMyOpu(opuId);

            // UI에서 제거
            setData((prev) => prev.filter((item) => item.id !== opuId));

            toastSuccess("OPU가 삭제되었어요.");
        } catch (e) {
            console.error(e);
            toastError("OPU를 삭제하지 못했어요.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleNextPage = () => {
        if (pageMeta?.hasNext) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageMeta?.hasPrevious && page > 0) {
            setPage((prev) => prev - 1);
        }
    };

    return {
        contextType,
        loading,

        // 목록
        data,
        filtered: data,
        page,
        pageMeta,
        handleNextPage,
        handlePrevPage,

        // 검색
        q,
        setQ,

        // 좋아요 필터
        onlyLiked,
        setOnlyLiked,

        // 필터
        times,
        categoryIds,
        filterMode,
        filterSheetOpen,
        timeLabel,
        categoryLabel,
        handleToggleTime,
        handleToggleCategory,
        handleResetFilter,
        setFilterMode,
        setFilterSheetOpen,
        handleOpenFilterTime,
        handleOpenFilterCategory,

        // 정렬
        sortOption,
        sortLabel,
        showSortSheet,
        setShowSortSheet,
        handleChangeSort,

        // 더보기 시트
        sheetId,
        selectedItem,
        isMine,
        handleOpenMore,
        handleCloseMore,
        handleEditSelected,

        // 투두리스트 추가
        handleAddTodoSelected,

        // 차단
        blockTargetId,
        setBlockTargetId,
        handleBlockSelected,

        // 공개 설정 토글
        handleShareToggle,

        // 삭제
        deleteTargetId,
        setDeleteTargetId,
        handleDeleteSelected,
    };
}
