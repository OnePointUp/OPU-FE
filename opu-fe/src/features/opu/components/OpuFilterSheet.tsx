"use client";

import { Icon } from "@iconify/react";
import BottomSheet from "@/components/common/BottomSheet";
import { CATEGORY_MAP, type OpuEntity } from "@/features/opu/domain";

type FilterMode = "period" | "category";

type PeriodCode = OpuEntity["required_time"] | "ALL";

type Props = {
    open: boolean;
    mode: FilterMode;

    selectedPeriods: PeriodCode[];
    selectedCategoryIds: number[];
    resultCount: number;

    onClose: () => void;
    onChangeMode: (mode: FilterMode) => void;
    onTogglePeriod: (value: PeriodCode) => void;
    onToggleCategory: (id: number) => void;
    onReset: () => void;
};

const PERIOD_OPTIONS: { code: PeriodCode; label: string }[] = [
    { code: "ALL", label: "소요시간 전체" },
    { code: "1M", label: "1분" },
    { code: "5M", label: "5분" },
    { code: "30M", label: "30분" },
    { code: "1H", label: "1시간" },
    { code: "DAILY", label: "1일" },
];

export default function OpuFilterSheet({
    open,
    mode,
    selectedPeriods,
    selectedCategoryIds,
    resultCount,
    onClose,
    onChangeMode,
    onTogglePeriod,
    onToggleCategory,
    onReset,
}: Props) {
    const periodTags =
        selectedPeriods.length === 0
            ? [
                  {
                      code: "ALL" as PeriodCode,
                      label: "소요시간 전체",
                      removable: false,
                  },
              ]
            : selectedPeriods.map((code) => ({
                  code,
                  label:
                      PERIOD_OPTIONS.find((p) => p.code === code)?.label ?? "",
                  removable: true,
              }));

    const categoryTags =
        selectedCategoryIds.length === 0
            ? [
                  {
                      id: -1,
                      label: "카테고리 전체",
                      removable: false,
                  },
              ]
            : selectedCategoryIds.map((id) => ({
                  id,
                  label: CATEGORY_MAP[id] ?? "알 수 없음",
                  removable: true,
              }));

    return (
        <BottomSheet open={open} onClose={onClose}>
            <div className="-my-2">
                <div className="max-h-[min(70vh,640px)] overflow-y-auto bg-[var(--background)]">
                    <div className="sticky top-0 z-10 bg-[var(--background)] pb-3">
                        <div className="px-3 pt-3 flex gap-4 text-[var(--text-sub)] font-[var(--weight-semibold)]">
                            <button
                                type="button"
                                onClick={() => onChangeMode("period")}
                                className={
                                    mode === "period"
                                        ? "text-[var(--text-sub)]"
                                        : "text-[var(--color-light-gray)]"
                                }
                            >
                                소요시간
                            </button>
                            <button
                                type="button"
                                onClick={() => onChangeMode("category")}
                                className={
                                    mode === "category"
                                        ? "text-[var(--text-sub)]"
                                        : "text-[var(--color-light-gray)]"
                                }
                            >
                                카테고리
                            </button>
                        </div>

                        {/* 선택된 필터 태그들 */}
                        <div className="mt-4 px-3 flex flex-wrap gap-2 text-[12px]">
                            {periodTags.map((tag) => (
                                <button
                                    key={`p-${tag.code}`}
                                    type="button"
                                    onClick={() =>
                                        tag.removable &&
                                        onTogglePeriod(tag.code)
                                    }
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full border-[1.5px] border-[var(--color-opu-green)] bg-[var(--background)]"
                                    style={{
                                        fontSize: "var(--text-caption)",
                                        fontWeight: "var(--weight-regular)",
                                        color: "var(--foregray)",
                                    }}
                                >
                                    <span>{tag.label}</span>
                                    {tag.removable && (
                                        <Icon
                                            icon="ic:round-close"
                                            width={14}
                                            height={14}
                                            style={{
                                                color: "var(--color-light-gray)",
                                            }}
                                        />
                                    )}
                                </button>
                            ))}

                            {categoryTags.map((tag) => (
                                <button
                                    key={`c-${tag.id}`}
                                    type="button"
                                    onClick={() =>
                                        tag.removable &&
                                        onToggleCategory(tag.id)
                                    }
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full border-[1.5px] border-[var(--color-opu-green)] bg-[var(--background)]"
                                    style={{
                                        fontSize: "var(--text-caption)",
                                        fontWeight: "var(--weight-regular)",
                                        color: "var(--foregray)",
                                    }}
                                >
                                    <span>{tag.label}</span>
                                    {tag.removable && (
                                        <Icon
                                            icon="ic:round-close"
                                            width={14}
                                            height={14}
                                            style={{
                                                color: "var(--color-light-gray)",
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[var(--color-super-light-gray)] pb-16">
                        {mode === "period" ? (
                            <PeriodList
                                selected={selectedPeriods}
                                onToggle={onTogglePeriod}
                            />
                        ) : (
                            <CategoryList
                                selectedIds={selectedCategoryIds}
                                onToggle={onToggleCategory}
                            />
                        )}
                    </div>

                    <div className="sticky bottom-0 z-10 bg-[var(--background)] border-t border-[var(--color-super-light-gray)] px-4 py-3 flex items-center gap-6">
                        <button
                            type="button"
                            onClick={onReset}
                            className="flex items-center gap-1"
                            style={{
                                fontSize: "var(--text-sub)",
                                fontWeight: "var(--weight-medium)",
                            }}
                        >
                            <Icon
                                icon="ph:arrow-counter-clockwise"
                                width={16}
                            />
                            <span>초기화</span>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-10 rounded-xl bg-[var(--color-opu-green)] text-white flex items-center justify-center"
                            style={{
                                fontSize: "var(--text-sub)",
                                fontWeight: "var(--weight-semibold)",
                            }}
                        >
                            {resultCount}개의 OPU 보기
                        </button>
                    </div>
                </div>
            </div>
        </BottomSheet>
    );
}

function PeriodList({
    selected,
    onToggle,
}: {
    selected: PeriodCode[];
    onToggle: (value: PeriodCode) => void;
}) {
    const isAll = selected.length === 0 || selected.includes("ALL");

    return (
        <ul>
            {PERIOD_OPTIONS.map((opt, index) => {
                const checked =
                    opt.code === "ALL"
                        ? isAll
                        : selected.includes(opt.code) && !isAll;

                return (
                    <li
                        key={opt.code}
                        className={
                            index === 0
                                ? "px-3 py-4 text-[var(--text-sub)]"
                                : "px-3 py-4 text-[var(--text-sub)] border-t border-[var(--color-super-light-gray)]"
                        }
                    >
                        <button
                            type="button"
                            className="w-full flex items-center justify-between"
                            onClick={() => onToggle(opt.code)}
                        >
                            <span
                                style={{
                                    fontWeight: checked
                                        ? "var(--weight-semibold)"
                                        : "var(--weight-regular)",
                                }}
                            >
                                {opt.label}
                            </span>

                            {checked && (
                                <Icon
                                    icon="ic:round-check"
                                    width={18}
                                    height={18}
                                    className="shrink-0"
                                    style={{ color: "var(--foreground)" }}
                                />
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

function CategoryList({
    selectedIds,
    onToggle,
}: {
    selectedIds: number[];
    onToggle: (id: number) => void;
}) {
    const entries = Object.entries(CATEGORY_MAP).map(([id, label]) => ({
        id: Number(id),
        label,
    }));

    const isAllSelected = selectedIds.length === 0;

    return (
        <ul>
            {/* 전체 */}
            <li className="px-3 py-4 text-[var(--text-sub)]">
                <button
                    type="button"
                    className="w-full flex items-center justify-between"
                    onClick={() => onToggle(-1)}
                >
                    <span
                        style={{
                            fontWeight: isAllSelected
                                ? "var(--weight-semibold)"
                                : "var(--weight-regular)",
                        }}
                    >
                        카테고리 전체
                    </span>
                    {isAllSelected && (
                        <Icon
                            icon="ic:round-check"
                            width={18}
                            height={18}
                            className="shrink-0"
                            style={{ color: "var(--foreground)" }}
                        />
                    )}
                </button>
            </li>

            {entries.map((item) => {
                const checked = selectedIds.includes(item.id);
                return (
                    <li
                        key={item.id}
                        className="px-3 py-4 text-[var(--text-sub)] border-t border-[var(--color-super-light-gray)]"
                    >
                        <button
                            type="button"
                            className="w-full flex items-center justify-between"
                            onClick={() => onToggle(item.id)}
                        >
                            <span
                                style={{
                                    fontWeight: checked
                                        ? "var(--weight-semibold)"
                                        : "var(--weight-regular)",
                                }}
                            >
                                {item.label}
                            </span>
                            {checked && (
                                <Icon
                                    icon="ic:round-check"
                                    width={18}
                                    height={18}
                                    className="shrink-0"
                                    style={{ color: "var(--foreground)" }}
                                />
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
