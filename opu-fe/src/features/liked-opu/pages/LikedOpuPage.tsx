"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import BottomSheet from "@/components/common/BottomSheet";
import ActionList from "@/components/common/ActionList";
import OpuFilterSheet from "@/features/opu/components/OpuFilterSheet";
import LikedOpuList from "@/features/liked-opu/components/LikedOpuList";
import type { OpuCardModel } from "@/features/opu/domain";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import { PeriodCode } from "@/features/opu/utils/period";
import {
    getSortLabel,
    SortOption,
    sortOpuList,
} from "@/features/opu/utils/sort";
import {
    filterOpuList,
    getCategoryFilterLabel,
    getPeriodFilterLabel,
} from "@/features/opu/utils/filter";
import OpuToolbar from "@/features/opu/components/OpuToolbar";

type FilterMode = "period" | "category";

type Props = {
    items: OpuCardModel[];
};

export default function LikedOpuPage({ items }: Props) {
    const [q, setQ] = useState("");
    const [sheetId, setSheetId] = useState<number | null>(null);

    const [filterMode, setFilterMode] = useState<FilterMode>("period");
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);

    const [periods, setPeriods] = useState<PeriodCode[]>([]);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);

    const [sortOption, setSortOption] = useState<SortOption>("name");
    const [showSortSheet, setShowSortSheet] = useState(false);

    // 정렬
    const sortedItems = useMemo(
        () => sortOpuList(items, sortOption),
        [items, sortOption]
    );

    // 검색 + 필터
    const filtered = useMemo(
        () =>
            filterOpuList(sortedItems, {
                q,
                periods,
                categoryIds,
            }),
        [sortedItems, q, periods, categoryIds]
    );

    // 라벨
    const periodLabel = useMemo(() => getPeriodFilterLabel(periods), [periods]);
    const categoryLabel = useMemo(
        () => getCategoryFilterLabel(categoryIds),
        [categoryIds]
    );
    const sortLabel = getSortLabel(sortOption);

    // 기간 토글
    const handleTogglePeriod = (value: PeriodCode) => {
        if (value === "ALL") {
            setPeriods([]);
            return;
        }

        setPeriods((prev) => {
            const filtered = prev.filter((p) => p !== "ALL");
            if (filtered.includes(value)) {
                return filtered.filter((p) => p !== value);
            }
            return [...filtered, value];
        });
    };

    // 카테고리 토글 (-1 = 전체)
    const handleToggleCategory = (id: number) => {
        if (id === -1) {
            setCategoryIds([]);
            return;
        }
        setCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleResetFilter = () => {
        setPeriods([]);
        setCategoryIds([]);
    };

    const handleChangeSort = (opt: SortOption) => {
        setSortOption(opt);
        setShowSortSheet(false);
    };

    return (
        <div className="app-container pt-app-header pb-40">
            {/* 검색 */}
            <div className="px-2">
                <SearchBar
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onSubmit={(v) => setQ(v)}
                    placeholder="찜한 OPU 검색"
                    className="mt-5 mb-6"
                />
            </div>

            {/* 정렬 / 필터 툴바 */}
            <OpuToolbar
                sortLabel={sortLabel}
                periodLabel={periodLabel}
                categoryLabel={categoryLabel}
                onClickSort={() => setShowSortSheet(true)}
                onClickPeriod={() => {
                    setFilterMode("period");
                    setFilterSheetOpen(true);
                }}
                onClickCategory={() => {
                    setFilterMode("category");
                    setFilterSheetOpen(true);
                }}
            />

            {/* 카드 리스트 */}
            <div className="mt-3">
                <LikedOpuList
                    items={filtered}
                    onMore={(id) => setSheetId(id)}
                />
            </div>

            {/* 카드 더보기 액션 시트 */}
            <BottomSheet
                open={sheetId !== null}
                onClose={() => setSheetId(null)}
            >
                {sheetId !== null && (
                    <ActionList
                        items={
                            items.find((i) => i.id === sheetId)?.creatorId ===
                            CURRENT_MEMBER_ID
                                ? [
                                      {
                                          label: "투두리스트 추가",
                                          onClick: () => {},
                                      },
                                      { label: "루틴 추가", onClick: () => {} },
                                      { label: "수정", onClick: () => {} },
                                      {
                                          label: "삭제",
                                          danger: true,
                                          onClick: () => {},
                                      },
                                  ]
                                : [
                                      {
                                          label: "투두리스트 추가",
                                          onClick: () => {},
                                      },
                                      { label: "루틴 추가", onClick: () => {} },
                                      {
                                          label: "차단하기",
                                          danger: true,
                                          onClick: () => {},
                                      },
                                  ]
                        }
                    />
                )}
            </BottomSheet>

            {/* 정렬 시트 */}
            <BottomSheet
                open={showSortSheet}
                onClose={() => setShowSortSheet(false)}
            >
                <ActionList
                    items={[
                        {
                            label: "이름순",
                            onClick: () => handleChangeSort("name"),
                        },
                        {
                            label: "최신순",
                            onClick: () => handleChangeSort("latest"),
                        },
                        {
                            label: "완료순",
                            onClick: () => handleChangeSort("completed"),
                        },
                        {
                            label: "찜 많은 순",
                            onClick: () => handleChangeSort("liked"),
                        },
                    ]}
                />
            </BottomSheet>

            {/* 기간 / 카테고리 필터 시트 */}
            <OpuFilterSheet
                open={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                mode={filterMode}
                selectedPeriods={periods}
                selectedCategoryIds={categoryIds}
                resultCount={filtered.length}
                onChangeMode={setFilterMode}
                onTogglePeriod={handleTogglePeriod}
                onToggleCategory={handleToggleCategory}
                onReset={handleResetFilter}
            />
        </div>
    );
}
