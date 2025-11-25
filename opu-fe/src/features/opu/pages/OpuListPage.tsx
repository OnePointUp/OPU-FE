"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import BottomSheet from "@/components/common/BottomSheet";
import ActionList from "@/components/common/ActionList";
import OpuFilterSheet from "@/features/opu/components/OpuFilterSheet";
import OpuToolbar from "@/features/opu/components/OpuToolbar";

import type { OpuCardModel } from "@/features/opu/domain";
import { CURRENT_MEMBER_ID } from "@/mocks/api/db/member.db";
import type { TimeCode } from "@/features/opu/utils/time";
import {
    getSortLabel,
    type SortOption,
    sortOpuList,
} from "@/features/opu/utils/sort";
import {
    filterOpuList,
    getCategoryFilterLabel,
    getTimeFilterLabel,
} from "@/features/opu/utils/filter";
import OpuList from "../components/OpuList";
import LikedOpuFilter from "../components/LikedOpuFilter";
import PlusButton from "@/components/common/PlusButton";
import { useRouter } from "next/navigation";

type FilterMode = "time" | "category";

type Props = {
    items: OpuCardModel[];
    contextType?: "my" | "shared";
};

export default function OpuListPage({ items, contextType }: Props) {
    const [q, setQ] = useState("");
    const [filterMode, setFilterMode] = useState<FilterMode>("time");
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [onlyLiked, setOnlyLiked] = useState(false);
    const [times, setTimes] = useState<TimeCode[]>([]);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>("name");
    const [showSortSheet, setShowSortSheet] = useState(false);

    const [data, setData] = useState<OpuCardModel[]>([]);
    const [loading, setLoading] = useState(true);

    const [sheetId, setSheetId] = useState<number | null>(null);

    // 목데이터로 로딩 시뮬레이션
    useEffect(() => {
        const timer = setTimeout(() => {
            setData(items);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [items]);

    // 정렬
    const sortedItems = useMemo(
        () => sortOpuList(data, sortOption),
        [data, sortOption]
    );

    // 검색 + 필터
    const filtered = useMemo(() => {
        const base = filterOpuList(sortedItems, {
            q,
            times,
            categoryIds,
        });

        return onlyLiked ? base.filter((item) => item.liked) : base;
    }, [sortedItems, q, times, categoryIds, onlyLiked]);

    const timeLabel = useMemo(() => getTimeFilterLabel(times), [times]);
    const categoryLabel = useMemo(
        () => getCategoryFilterLabel(categoryIds),
        [categoryIds]
    );
    const sortLabel = getSortLabel(sortOption);

    const handleToggleTime = (value: TimeCode) => {
        if (value === "ALL") {
            setTimes([]);
            return;
        }

        setTimes((prev) => {
            const filtered = prev.filter((p) => p !== "ALL");
            if (filtered.includes(value)) {
                return filtered.filter((p) => p !== value);
            }
            return [...filtered, value];
        });
    };

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
        setTimes([]);
        setCategoryIds([]);
    };

    const handleChangeSort = (opt: SortOption) => {
        setSortOption(opt);
        setShowSortSheet(false);
    };

    const selectedItem =
        sheetId !== null ? data.find((i) => i.id === sheetId) : undefined;

    return (
        <section>
            {/* 검색 */}
            <SearchBar
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onSubmit={(v) => setQ(v)}
                placeholder={
                    contextType === "shared" ? "공유 OPU 검색" : "나의 OPU 검색"
                }
                className="mb-6"
            />

            {/* 정렬 / 필터 툴바 */}
            <div className="w-full pl-1 flex items-center justify-between">
                <LikedOpuFilter checked={onlyLiked} onChange={setOnlyLiked} />
                <OpuToolbar
                    sortLabel={sortLabel}
                    timeLabel={timeLabel}
                    categoryLabel={categoryLabel}
                    onClickSort={() => setShowSortSheet(true)}
                    onClickTime={() => {
                        setFilterMode("time");
                        setFilterSheetOpen(true);
                    }}
                    onClickCategory={() => {
                        setFilterMode("category");
                        setFilterSheetOpen(true);
                    }}
                />
            </div>

            {/* 카드 리스트 */}
            <div className="mt-3 -mx-1">
                <OpuList
                    items={filtered}
                    loading={loading}
                    onMore={(id) => setSheetId(id)}
                    contextType={contextType}
                />
            </div>

            {/* 카드 더보기 액션 시트 */}
            <MoreActionsSheet
                open={sheetId !== null}
                onClose={() => setSheetId(null)}
                target={selectedItem}
            />

            {/* 정렬 시트 */}
            <SortSheet
                open={showSortSheet}
                onClose={() => setShowSortSheet(false)}
                current={sortOption}
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
                onChangeMode={setFilterMode}
                onToggleTime={handleToggleTime}
                onToggleCategory={handleToggleCategory}
                onReset={handleResetFilter}
            />

            <PlusButton />
        </section>
    );
}

type SortSheetProps = {
    open: boolean;
    onClose: () => void;
    current: SortOption;
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
                    {
                        label: "이름순",
                        onClick: handleSelect("name"),
                    },
                    {
                        label: "최신순",
                        onClick: handleSelect("latest"),
                    },
                    {
                        label: "완료순",
                        onClick: handleSelect("completed"),
                    },
                    {
                        label: "찜 많은 순",
                        onClick: handleSelect("liked"),
                    },
                ]}
            />
        </BottomSheet>
    );
}

type MoreActionsSheetProps = {
    open: boolean;
    onClose: () => void;
    target?: OpuCardModel;
};

function MoreActionsSheet({ open, onClose, target }: MoreActionsSheetProps) {
    const router = useRouter();

    if (!target) {
        return null;
    }

    const isMine = target.creatorId === CURRENT_MEMBER_ID;

    const items = isMine
        ? [
              {
                  label: "투두리스트 추가",
                  onClick: () => {},
              },
              { label: "루틴 추가", onClick: () => {} },
              {
                  label: "수정",
                  onClick: () => router.push(`/opu/edit/${target.id}`),
              },
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
          ];

    return (
        <BottomSheet open={open} onClose={onClose}>
            <ActionList items={items} />
        </BottomSheet>
    );
}
