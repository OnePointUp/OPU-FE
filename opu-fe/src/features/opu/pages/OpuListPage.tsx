"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/common/SearchBar";
import BottomSheet from "@/components/common/BottomSheet";
import ActionList, { ActionItem } from "@/components/common/ActionList";
import OpuFilterSheet from "@/features/opu/components/OpuFilterSheet";
import OpuToolbar from "@/features/opu/components/OpuToolbar";
import OpuList from "../components/OpuList";
import LikedOpuFilter from "../components/LikedOpuFilter";
import PlusButton from "@/components/common/PlusButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import OpuDuplicateListModal from "@/features/opu/components/OpuDuplicateListModal";

import type { OpuCardModel, SortOption } from "@/features/opu/domain";
import { useOpuListPage } from "../hooks/useOpuListPage";

type Props = {
    contextType?: "my" | "shared" | "liked";
    showLikedFilter?: boolean;
};

export default function OpuListPage({
    contextType,
    showLikedFilter = true,
}: Props) {
    const {
        filtered,
        loading,
        loadingMore,

        // 검색
        q,
        setQ,

        // 라벨
        timeLabel,
        categoryLabel,
        sortLabel,

        // 좋아요
        onlyLiked,
        setOnlyLiked,
        handleToggleFavorite,

        // 정렬
        showSortSheet,
        setShowSortSheet,
        handleChangeSort,

        // 필터
        filterMode,
        filterSheetOpen,
        setFilterSheetOpen,
        handleOpenFilterTime,
        handleOpenFilterCategory,
        times,
        categoryIds,
        handleToggleTime,
        handleToggleCategory,
        handleResetFilter,
        setFilterMode,

        // 더보기
        selectedItem,
        sheetId,
        handleOpenMore,
        handleCloseMore,
        isMine,
        handleBlockSelected,
        blockTargetId,
        setBlockTargetId,
        handleAddTodoSelected,
        handleShareToggle,

        // 무한 스크롤
        handleNextPage,

        // 삭제
        deleteTargetId,
        setDeleteTargetId,
        handleDeleteSelected,

        // 중복
        duplicateModalOpen,
        setDuplicateModalOpen,
        duplicates,
        setPendingShareOpuId,
    } = useOpuListPage({ contextType });

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ==============================
       무한 스크롤 sentinel
    ============================== */
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                if (loading || loadingMore) return;
                handleNextPage();
            },
            {
                threshold: 0,
                rootMargin: "200px",
            }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [handleNextPage, loading, loadingMore]);

    return (
        <section>
            {/* 검색 */}
            <SearchBar
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onSubmit={(v) => setQ(v)}
                placeholder="OPU의 키워드를 검색해보세요"
                className="mb-6"
            />

            {/* 툴바 */}
            <div className="w-full pl-1 flex items-center justify-between">
                {showLikedFilter ? (
                    <LikedOpuFilter
                        checked={onlyLiked}
                        onChange={setOnlyLiked}
                    />
                ) : (
                    <span />
                )}

                <OpuToolbar
                    sortLabel={sortLabel}
                    timeLabel={timeLabel}
                    categoryLabel={categoryLabel}
                    onClickSort={() => setShowSortSheet(true)}
                    onClickTime={handleOpenFilterTime}
                    onClickCategory={handleOpenFilterCategory}
                />
            </div>

            {/* 카드 리스트 */}
            <div className="mt-3 -mx-1" style={{ overflowAnchor: "none" }}>
                <OpuList
                    items={filtered}
                    loading={loading}
                    onMore={handleOpenMore}
                    onToggleFavorite={handleToggleFavorite}
                    contextType={contextType}
                />

                {/* 다음 페이지 로딩 스켈레톤 */}
                {loadingMore && (
                    <div className="mt-4">
                        <OpuList items={[]} loading />
                    </div>
                )}
            </div>

            {/* sentinel */}
            <div ref={loadMoreRef} style={{ height: 1 }} />

            {/* 더보기 시트 */}
            <MoreActionsSheet
                open={sheetId !== null}
                onClose={handleCloseMore}
                target={selectedItem}
                isMine={isMine}
                onRequestBlock={() => {
                    if (!selectedItem) return;
                    setBlockTargetId(selectedItem.id);
                    setShowBlockModal(true);
                }}
                onAddTodo={() => {
                    if (!selectedItem) return;
                    handleAddTodoSelected(selectedItem.id);
                }}
                onToggleShare={
                    selectedItem
                        ? () =>
                              handleShareToggle(
                                  selectedItem.id,
                                  selectedItem.isShared ?? false
                              )
                        : undefined
                }
                onDelete={
                    selectedItem
                        ? () => {
                              setDeleteTargetId(selectedItem.id);
                              setShowDeleteModal(true);
                          }
                        : undefined
                }
            />

            {/* 정렬 시트 */}
            <SortSheet
                open={showSortSheet}
                onClose={() => setShowSortSheet(false)}
                onChange={handleChangeSort}
            />

            {/* 필터 시트 */}
            <OpuFilterSheet
                open={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                mode={filterMode}
                selectedTimes={times}
                selectedCategoryIds={categoryIds}
                resultCount={filtered.length}
                onChangeMode={setFilterMode}
                onToggleTime={handleToggleTime}
                onToggleCategory={handleToggleCategory}
                onReset={handleResetFilter}
            />

            {contextType !== "liked" && <PlusButton showMenu={false} />}

            {/* 차단 모달 */}
            <ConfirmModal
                isOpen={showBlockModal}
                message={`이 OPU를 차단할까요?\n차단하면 목록에서 보이지 않아요.`}
                onConfirm={() => {
                    if (blockTargetId != null) {
                        handleBlockSelected(blockTargetId);
                    }
                    setShowBlockModal(false);
                }}
                onCancel={() => setShowBlockModal(false)}
            />

            {/* 삭제 모달 */}
            <ConfirmModal
                isOpen={showDeleteModal}
                message={`이 OPU를 삭제할까요?\n삭제하면 되돌릴 수 없어요.`}
                onConfirm={() => {
                    if (deleteTargetId != null) {
                        handleDeleteSelected(deleteTargetId);
                    }
                    setShowDeleteModal(false);
                }}
                onCancel={() => setShowDeleteModal(false)}
            />

            <OpuDuplicateListModal
                open={duplicateModalOpen}
                mode="share"
                duplicates={duplicates}
                onSelectOpu={async (opuId) => {
                    await handleAddTodoSelected(opuId);
                    setDuplicateModalOpen(false);
                    setPendingShareOpuId(null);
                }}
                onClose={() => {
                    setDuplicateModalOpen(false);
                    setPendingShareOpuId(null);
                }}
            />
        </section>
    );
}

/* ==============================
   하단 컴포넌트
============================== */

type SortSheetProps = {
    open: boolean;
    onClose: () => void;
    onChange: (opt: SortOption) => void;
};

function SortSheet({ open, onClose, onChange }: SortSheetProps) {
    const handleSelect = (opt: SortOption) => () => {
        onChange(opt);
        onClose();
    };

    return (
        <BottomSheet open={open} onClose={onClose}>
            <ActionList
                items={[
                    { label: "인기순", onClick: handleSelect("liked") },
                    { label: "완료순", onClick: handleSelect("completed") },
                    { label: "이름순", onClick: handleSelect("name") },
                    { label: "최신순", onClick: handleSelect("latest") },
                ]}
            />
        </BottomSheet>
    );
}

type MoreActionsSheetProps = {
    open: boolean;
    onClose: () => void;
    target?: OpuCardModel;
    isMine: boolean;
    onRequestBlock: () => void;
    onAddTodo: () => void;
    onToggleShare?: () => void;
    onDelete?: () => void;
};

function MoreActionsSheet({
    open,
    onClose,
    target,
    isMine,
    onRequestBlock,
    onAddTodo,
    onToggleShare,
    onDelete,
}: MoreActionsSheetProps) {
    if (!target) return null;

    const items: ActionItem[] = [
        {
            label: "투두리스트 추가",
            onClick: () => {
                onAddTodo();
                onClose();
            },
        },
    ];

    if (isMine && onToggleShare) {
        items.push({
            label: target.isShared ? "비공개로 전환" : "공개하기",
            onClick: () => {
                onToggleShare();
                onClose();
            },
        });
    }

    items.push(
        isMine
            ? {
                  label: "삭제",
                  danger: true,
                  onClick: () => {
                      onDelete?.();
                      onClose();
                  },
              }
            : {
                  label: "차단하기",
                  danger: true,
                  onClick: () => {
                      onRequestBlock();
                      onClose();
                  },
              }
    );

    return (
        <BottomSheet open={open} onClose={onClose}>
            <ActionList items={items} />
        </BottomSheet>
    );
}
