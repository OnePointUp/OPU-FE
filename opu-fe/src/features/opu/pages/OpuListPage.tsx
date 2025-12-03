"use client";

import { useState } from "react";

import SearchBar from "@/components/common/SearchBar";
import BottomSheet from "@/components/common/BottomSheet";
import ActionList from "@/components/common/ActionList";
import OpuFilterSheet from "@/features/opu/components/OpuFilterSheet";
import OpuToolbar from "@/features/opu/components/OpuToolbar";
import OpuList from "../components/OpuList";
import LikedOpuFilter from "../components/LikedOpuFilter";
import PlusButton from "@/components/common/PlusButton";
import ConfirmModal from "@/components/common/ConfirmModal";

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
        // 검색
        q,
        setQ,
        // 정렬/필터 라벨
        timeLabel,
        categoryLabel,
        sortLabel,
        // 좋아요 필터
        onlyLiked,
        setOnlyLiked,
        // 정렬 시트
        showSortSheet,
        setShowSortSheet,
        handleChangeSort,
        // 필터 시트
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
        // 더보기 시트
        selectedItem,
        sheetId,
        handleOpenMore,
        handleCloseMore,
        isMine,
        handleEditSelected,
        handleBlockSelected,
        blockTargetId,
        setBlockTargetId,
        handleAddTodoSelected,
    } = useOpuListPage({ contextType });

    const [showBlockModal, setShowBlockModal] = useState(false);

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

            {/* 정렬 / 필터 툴바 / 찜 필터 */}
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
            <div className="mt-3 -mx-1">
                <OpuList
                    items={filtered}
                    loading={loading}
                    onMore={handleOpenMore}
                    contextType={contextType}
                />
            </div>

            {/* 카드 더보기 액션 시트 */}
            <MoreActionsSheet
                open={sheetId !== null}
                onClose={handleCloseMore}
                target={selectedItem}
                isMine={isMine}
                onEdit={handleEditSelected}
                onRequestBlock={() => {
                    if (!selectedItem) return;
                    setBlockTargetId(selectedItem.id);
                    handleCloseMore();
                    setShowBlockModal(true);
                }}
                onAddTodo={() => {
                    if (!selectedItem) return;
                    handleAddTodoSelected(selectedItem.id);
                    handleCloseMore();
                }}
            />

            {/* 정렬 시트 */}
            <SortSheet
                open={showSortSheet}
                onClose={() => setShowSortSheet(false)}
                onChange={handleChangeSort}
            />

            {/* 기간 / 카테고리 필터 시트 */}
            <OpuFilterSheet
                open={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                mode={filterMode}
                selectedTimes={times}
                selectedCategoryIds={categoryIds}
                resultCount={filtered.length}
                onChangeMode={() => {}}
                onToggleTime={handleToggleTime}
                onToggleCategory={handleToggleCategory}
                onReset={handleResetFilter}
            />

            <PlusButton showMenu={false} />

            {/* 차단 ConfirmModal */}
            <ConfirmModal
                isOpen={showBlockModal}
                message={`이 OPU를 차단할까요?\n차단하면 랜덤 뽑기와 목록에서 보이지 않아요.`}
                onConfirm={() => {
                    if (blockTargetId != null) {
                        handleBlockSelected(blockTargetId);
                    }
                    setShowBlockModal(false);
                }}
                onCancel={() => setShowBlockModal(false)}
            />
        </section>
    );
}

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
    onEdit: () => void;
    onRequestBlock: () => void;
    onAddTodo: () => void;
};

function MoreActionsSheet({
    open,
    onClose,
    target,
    isMine,
    onEdit,
    onRequestBlock,
    onAddTodo,
}: MoreActionsSheetProps) {
    if (!target) return null;

    const items = isMine
        ? [
              { label: "투두리스트 추가", onClick: onAddTodo },
              { label: "루틴 추가", onClick: () => {} },
              { label: "수정", onClick: onEdit },
              { label: "삭제", danger: true, onClick: () => {} },
          ]
        : [
              { label: "투두리스트 추가", onClick: onAddTodo },
              { label: "루틴 추가", onClick: () => {} },
              { label: "차단하기", danger: true, onClick: onRequestBlock },
          ];

    return (
        <BottomSheet open={open} onClose={onClose}>
            <ActionList items={items} />
        </BottomSheet>
    );
}
