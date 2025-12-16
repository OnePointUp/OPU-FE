"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
    OpuDuplicateItem,
} from "@/features/opu/domain";
import {
    fetchMyOpuList,
    fetchSharedOpuList,
    fetchLikedOpuList,
    addTodoByOpu,
    shareOpu,
    unshareOpu,
    deleteMyOpu,
} from "../service";
import { toastError, toastSuccess } from "@/lib/toast";
import { blockOpu } from "@/features/blocked-opu/services";
import { useOpuCategories } from "./useOpuCategories";

export type FilterMode = "time" | "category";

type Props = {
    contextType?: "my" | "shared" | "liked";
};

const PAGE_SIZE = 20;

export function useOpuListPage({ contextType = "shared" }: Props) {
    const router = useRouter();
    const fetchingRef = useRef(false);
    const { categoryMap } = useOpuCategories();

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

    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

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

    const [pendingShareOpuId, setPendingShareOpuId] = useState<number | null>(
        null
    );

    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [duplicates, setDuplicates] = useState<OpuDuplicateItem[]>([]);

    useEffect(() => {
        setPage(0);
        setData([]);
        setInitialLoading(true);

        fetchingRef.current = false;
    }, [contextType]);

    const requestFilter: OpuListFilterRequest = useMemo(() => {
        const minutes =
            times.length === 0
                ? undefined
                : times
                      .filter((t): t is Exclude<TimeCode, "ALL"> => t !== "ALL")
                      .map((t) => TIME_CODE_TO_MINUTES[t])
                      .filter(Boolean);

        return {
            categoryIds: categoryIds.length ? categoryIds : undefined,
            requiredMinutes: minutes?.length ? minutes : undefined,
            search: q.trim() || undefined,
            favoriteOnly:
                contextType === "liked" ? undefined : onlyLiked || undefined,
            sort: SORT_OPTION_TO_API_SORT[sortOption],
        };
    }, [q, times, categoryIds, onlyLiked, sortOption, contextType]);

    /** ================= fetch ================= */
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;

            try {
                if (page > 0) setLoadingMore(true);

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

                setData((prev) =>
                    page === 0 ? res.content : [...prev, ...res.content]
                );

                setPageMeta({
                    totalElements: res.totalElements,
                    totalPages: res.totalPages,
                    currentPage: res.currentPage,
                    pageSize: res.pageSize,
                    hasNext: res.hasNext,
                    hasPrevious: res.hasPrevious,
                });
            } catch {
                if (!cancelled) toastError("OPU 목록을 불러오지 못했어요.");
            } finally {
                if (!cancelled) {
                    setInitialLoading(false);
                    setLoadingMore(false);
                }
                fetchingRef.current = false;
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [contextType, page, requestFilter]);

    /** ================= infinite scroll ================= */
    const handleNextPage = useCallback(() => {
        if (!pageMeta?.hasNext) return;
        if (fetchingRef.current) return;
        setPage((p) => p + 1);
    }, [pageMeta?.hasNext]);

    /** ================= handlers ================= */
    const timeLabel = useMemo(() => getTimeFilterLabel(times), [times]);
    const categoryLabel = useMemo(
        () => getCategoryFilterLabel(categoryIds, categoryMap),
        [categoryIds, categoryMap]
    );
    const sortLabel = getSortLabel(sortOption);

    const resetAndReload = () => {
        fetchingRef.current = false;
        setPage(0);
        setData([]);
        setInitialLoading(true);
    };

    const handleChangeSort = (opt: SortOption) => {
        setSortOption(opt);
        setShowSortSheet(false);
        resetAndReload();
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
        resetAndReload();
    };

    // 카테고리 필터 토글
    const handleToggleCategory = (id: number) => {
        if (id === -1) {
            setCategoryIds([]);
            setPage(0);
            return;
        }
        setCategoryIds((prev) =>
            id === -1
                ? []
                : prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
        resetAndReload();
    };

    const handleResetFilter = () => {
        setTimes([]);
        setCategoryIds([]);
        resetAndReload();
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
        if (selectedItem) router.push(`/opu/edit/${selectedItem.id}`);
    };

    // 차단하기
    const handleBlockSelected = async (opuId: number) => {
        try {
            await blockOpu(opuId);
            setData((prev) => prev.filter((i) => i.id !== opuId));
            toastSuccess("OPU를 차단했어요.");
        } catch {
            toastError("OPU 차단을 실패했어요");
        }
    };

    // 투두리스트 추가
    const handleAddTodoSelected = async (opuId: number) => {
        try {
            await addTodoByOpu(opuId);
            toastSuccess("해당 OPU가 오늘 할 일에 추가됐어요");
        } catch {
            toastError("오늘 할 일 추가에 실패했어요.");
        }
    };

    const updateSharedState = (opuId: number, isShared: boolean) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === opuId ? { ...item, isShared } : item
            )
        );
    };

    const handleUnshare = async (opuId: number) => {
        try {
            await unshareOpu(opuId);
            updateSharedState(opuId, false);
            toastSuccess("OPU가 비공개로 전환되었습니다");
        } catch {
            toastError("OPU 비공개 전환에 실패했어요");
        }
    };

    const handleShare = async (opuId: number) => {
        try {
            const result = await shareOpu(opuId);

            if (result.created) {
                updateSharedState(opuId, true);
                toastSuccess("OPU가 공개로 전환되었습니다");
                return;
            }

            // 중복 존재 → 모달 오픈
            setPendingShareOpuId(opuId);
            setDuplicates(result.duplicates);
            setDuplicateModalOpen(true);
        } catch {
            toastError("OPU 공개 전환에 실패했어요");
        }
    };

    // 공개/비공개 토글
    const handleShareToggle = async (
        opuId: number,
        isCurrentlyShared?: boolean
    ) => {
        if (isCurrentlyShared) {
            await handleUnshare(opuId);
        } else {
            await handleShare(opuId);
        }
    };

    const handleDeleteSelected = async (opuId: number) => {
        if (deleteLoading) return;
        setDeleteLoading(true);

        try {
            await deleteMyOpu(opuId);
            setData((prev) => prev.filter((i) => i.id !== opuId));
            toastSuccess("OPU가 삭제되었어요.");
        } catch {
            toastError("OPU를 삭제하지 못했어요.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        contextType,
        loading: initialLoading,
        loadingMore,

        // 목록
        data,
        filtered: data,

        pageMeta,
        handleNextPage,

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

        //중복
        duplicateModalOpen,
        setDuplicateModalOpen,
        duplicates,
        pendingShareOpuId,
        setPendingShareOpuId,
    };
}
