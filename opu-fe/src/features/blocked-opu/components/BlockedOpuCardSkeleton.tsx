"use client";

type SkeletonProps = {
    selectable?: boolean;
};

export default function BlockedOpuCardSkeleton({
    selectable = false,
}: SkeletonProps) {
    return (
        <div className="flex items-start gap-1">
            {selectable && (
                <div className="ml-1">
                    <div className="skeleton w-3 h-3 rounded-[4px]" />
                </div>
            )}

            <div className="w-full bg-[var(--background)]">
                <div className="ml-1">
                    <div className="flex items-start gap-3">
                        {/* 이모지 자리 */}
                        <div className="skeleton w-12 h-11 flex rounded-2xl mt-0.5"></div>

                        {/* 텍스트 영역 */}
                        <div className="w-full flex flex-col">
                            {/* 제목 + 더보기 아이콘 */}
                            <div className="flex items-start justify-between">
                                <div className="skeleton h-4 w-32 rounded-md" />
                                <div className="skeleton h-4 w-4 rounded-full" />
                            </div>

                            {/* 뱃지 + 차단일 */}
                            <div className="mt-2 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="skeleton h-5 w-14 rounded-full" />
                                    <div className="skeleton h-5 w-12 rounded-full" />
                                </div>
                                <div className="skeleton h-3 w-24 rounded-md shrink-0" />
                            </div>
                        </div>
                    </div>

                    <div className="h-[1px] bg-[var(--color-super-light-gray)] mt-3" />
                </div>
            </div>
        </div>
    );
}
