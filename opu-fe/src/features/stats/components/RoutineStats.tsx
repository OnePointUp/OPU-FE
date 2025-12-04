import type { FC } from "react";
// import { useRoutineStats } from "../hooks/useRoutineStats";

type Props = {
    year: number;
    month: number;
};

const RoutineStats: FC<Props> = ({ year, month }) => {
    // const { data, loading } = useRoutineStats({ year, month });

    return (
        <div className="space-y-4">
            {/* 상단 필터 (전체 / 루틴별) */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="rounded-full bg-[var(--color-chip-bg)] px-3 py-1 text-xs font-medium">
                    전체
                </button>
                <button className="rounded-full bg-[#FFE8EC] px-3 py-1 text-xs font-medium">
                    물 2L 마시기
                </button>
                <button className="rounded-full bg-[#FFF7D9] px-3 py-1 text-xs font-medium">
                    산책하기
                </button>
                {/* TODO: 실제 데이터 기준 동적 생성 */}
            </div>

            {/* 요약 카드 3개 */}
            <section className="grid grid-cols-3 gap-2">
                <StatsCard title="전체 달성률" value="86%" />
                <StatsCard title="연속 성공" value="12" suffix="일" />
                <StatsCard title="완료" value="26" suffix="회" />
            </section>

            {/* 캘린더 */}
            <StatsCalendar />
        </div>
    );
};

export default RoutineStats;

type StatsCardProps = {
    title: string;
    value: string | number;
    suffix?: string;
};

function StatsCard({ title, value, suffix }: StatsCardProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-super-light-gray)] bg-white py-3 text-center shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
            <p className="mb-2 text-[11px] text-[var(--color-text-subtle)]">
                {title}
            </p>
            <p className="text-[20px] font-semibold">
                {value}
                {suffix && (
                    <span className="ml-[1px] text-[12px] font-medium">
                        {suffix}
                    </span>
                )}
            </p>
        </div>
    );
}

function StatsCalendar() {
    // TODO: 달력 데이터는 나중에 props/훅으로
    return (
        <section className="mt-2 rounded-3xl border border-[var(--color-super-light-gray)] bg-white px-4 pb-4 pt-3">
            {/* 요일 헤더 */}
            <div className="mb-2 grid grid-cols-7 text-center text-[11px] text-[var(--color-text-subtle)]">
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span>토</span>
                <span className="text-[var(--color-like-pink)]">일</span>
            </div>

            {/* 날짜 그리드: 일단 레이아웃만 */}
            <div className="grid grid-cols-7 gap-2 text-center text-[11px]">
                {Array.from({ length: 31 }).map((_, idx) => {
                    const day = idx + 1;
                    const done = [
                        1, 2, 3, 8, 9, 14, 15, 16, 18, 19, 20, 21, 22, 24,
                    ].includes(day);
                    return (
                        <div
                            key={day}
                            className={`flex h-8 items-center justify-center rounded-xl ${
                                done
                                    ? "bg-[#CFEF9B] text-[var(--color-text-strong)]"
                                    : "bg-[var(--color-chip-bg)] text-[var(--color-text-subtle)]"
                            }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
