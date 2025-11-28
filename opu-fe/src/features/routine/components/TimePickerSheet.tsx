"use client";

import { useEffect, useRef, useState, UIEvent } from "react";
import OpuActionButton from "@/components/common/OpuActionButton";

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const SPACER_COUNT = 2;
const SPACER_HEIGHT = ITEM_HEIGHT * SPACER_COUNT;

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AMPM_VALUES = ["오전", "오후"];

type TimePickerProps = {
    current: string | null;
    onConfirm: (value: string | null) => void;
    onClose?: () => void;
};

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

export default function TimePickerSheet({
    current,
    onConfirm,
}: TimePickerProps) {
    let initHour24: number;
    let initMinute: number;

    const now = new Date();
    if (current) {
        const [h, m] = current.split(":");
        const hh = Number(h);
        const mm = Number(m);
        if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
            initHour24 = hh;
            initMinute = mm;
        } else {
            initHour24 = now.getHours();
            initMinute = now.getMinutes();
        }
    } else {
        initHour24 = now.getHours();
        initMinute = now.getMinutes();
    }

    const initialIsPm = initHour24 >= 12;
    const initialHour12 = ((initHour24 + 11) % 12) + 1;

    const [ampmIndex, setAmPmIndex] = useState(initialIsPm ? 1 : 0);
    const [hourIndex, setHourIndex] = useState(HOURS_12.indexOf(initialHour12));
    const [minuteIndex, setMinuteIndex] = useState(initMinute);

    const ampmRef = useRef<HTMLDivElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);

    const handleScroll = (
        e: UIEvent<HTMLDivElement>,
        maxIndex: number,
        setIndex: (i: number) => void,
        currentIndex: number
    ) => {
        const target = e.currentTarget;
        const scrollTop = target.scrollTop;

        // 반올림을 통해 가장 가까운 인덱스 계산
        let newIndex = Math.round(scrollTop / ITEM_HEIGHT);

        // 범위 제한
        if (newIndex < 0) newIndex = 0;
        if (newIndex > maxIndex) newIndex = maxIndex;

        if (newIndex !== currentIndex) {
            setIndex(newIndex);
            if (typeof navigator !== "undefined" && navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    };

    // 초기 위치 설정 (마운트 시 한 번만 실행)
    useEffect(() => {
        const initScroll = (element: HTMLDivElement | null, idx: number) => {
            if (element) {
                element.scrollTop = idx * ITEM_HEIGHT;
            }
        };
        initScroll(ampmRef.current, initialIsPm ? 1 : 0);
        initScroll(hourRef.current, HOURS_12.indexOf(initialHour12));
        initScroll(minuteRef.current, initMinute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 특정 항목 클릭 시 해당 위치로 부드럽게 이동
    const scrollToItem = (element: HTMLDivElement | null, idx: number) => {
        if (element) {
            element.scrollTo({
                top: idx * ITEM_HEIGHT,
                behavior: "smooth",
            });
        }
    };

    const handleDone = () => {
        const isPm = ampmIndex === 1;
        const hour12 = HOURS_12[hourIndex];
        const minute = MINUTES[minuteIndex];

        let h24: number;
        if (isPm) {
            h24 = hour12 === 12 ? 12 : hour12 + 12;
        } else {
            h24 = hour12 === 12 ? 0 : hour12;
        }

        if (h24 === 24) h24 = 0;

        onConfirm(`${pad2(h24)}:${pad2(minute)}`);
    };

    // const labelStyle: React.CSSProperties = {
    //     fontSize: "var(--text-body)",
    //     fontWeight: "var(--weight-medium)",
    //     color: "var(--color-dark-navy)",
    // };

    // 휠 컨테이너 스타일
    const wheelContainerStyle: React.CSSProperties = {
        height: ITEM_HEIGHT * VISIBLE_COUNT,
        overflowY: "auto",
        scrollSnapType: "y mandatory", // Y축 강제 스냅
        overscrollBehaviorY: "contain", // 부모 스크롤 방지
        WebkitOverflowScrolling: "touch",
        paddingTop: SPACER_HEIGHT,
        paddingBottom: SPACER_HEIGHT,
        maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        scrollbarWidth: "none", // 파이어폭스 스크롤바 숨김
        msOverflowStyle: "none", // IE 스크롤바 숨김
    };

    const wheelItemStyle: React.CSSProperties = {
        height: ITEM_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scrollSnapAlign: "center", // 아이템 중앙이 뷰포트 중앙에 맞도록 설정
        transition: "all 0.1s ease-out", // 부드러운 스타일 변경
        cursor: "pointer",
    };

    // 개별 휠 렌더링 함수
    const renderWheel = (
        items: (string | number)[],
        idx: number,
        setIdx: (i: number) => void,
        ref: React.RefObject<HTMLDivElement | null>
    ) => (
        <div className="flex flex-col items-center justify-center px-2 relative">
            <div
                ref={ref}
                className="no-scrollbar w-16"
                style={wheelContainerStyle}
                onScroll={(e) => handleScroll(e, items.length - 1, setIdx, idx)}
            >
                {items.map((val, i) => {
                    const isSelected = i === idx;
                    const distance = Math.abs(i - idx);

                    // 거리별 스타일 계산
                    const opacity = isSelected
                        ? 1
                        : Math.max(0.2, 1 - distance * 0.4);
                    const scale = isSelected
                        ? 1.1
                        : Math.max(0.8, 1 - distance * 0.1);
                    const color = isSelected ? "#000000" : "#a1a1a1";
                    const fontWeight = isSelected
                        ? "var(--weight-medium)"
                        : "var(--weight-regular)";

                    return (
                        <div
                            key={val}
                            style={{
                                ...wheelItemStyle,
                                opacity,
                                transform: `scale(${scale})`,
                                color,
                                fontWeight,
                            }}
                            onClick={() => {
                                setIdx(i);
                                scrollToItem(ref.current, i);
                            }}
                        >
                            {typeof val === "number" ? pad2(val) : val}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="px-3 pb-10 w-full bg-white rounded-t-xl select-none">
            {/* 헤더 */}
            {/* <div className="text-center mt-2">
                <span style={labelStyle}>시간 설정</span>
            </div> */}

            {/* 휠 영역 컨테이너 */}
            <div className="relative flex justify-center items-center gap-2 mb-5">
                {/* 중앙 선택 가이드 라인 */}
                <div className="absolute top-1/2 left-4 right-4 h-[40px] -translate-y-1/2 pointer-events-none rounded-lg bg-blue-100/20 z-0" />

                <div className="z-10 flex gap-2 items-center">
                    {renderWheel(AMPM_VALUES, ampmIndex, setAmPmIndex, ampmRef)}

                    {renderWheel(HOURS_12, hourIndex, setHourIndex, hourRef)}

                    {/* 시/분 사이 구분자 (:) */}
                    <div className="h-[200px] flex items-center justify-center font-bold text-lg pb-1">
                        :
                    </div>

                    {renderWheel(
                        MINUTES,
                        minuteIndex,
                        setMinuteIndex,
                        minuteRef
                    )}
                </div>
            </div>

            {/* 하단 버튼 */}
            {/* <button
                type="button"
                onClick={() => onConfirm(null)}
                className="h-13.5 w-full rounded-[18px] border border-[var(--color-super-light-gray)] bg-white hover:bg-gray-50 active:scale-[0.98] transition-transform"
                style={{ color: "var(--color-dark-gray)" }}
            >
                시간 없음
            </button> */}
            <OpuActionButton label="완료" onClick={handleDone} />

            <style jsx global>{`
                /* 스크롤바 숨기기 (크롬, 사파리, 엣지) */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
