'use client'

import React from 'react'
import clsx from 'clsx'

// 캘린더 속성
interface CalendarDayProps {
  date: number
  events?: string[]
  isToday?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

export default function CalendarDay({
  date,
  events = [],
  isToday,
  isSelected,
  isDisabled,
  onClick,
}: CalendarDayProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'flex flex-col items-center rounded-[8px] justify-start transition-all duration-150',
        'p-2 sm:p-3 md:p-4',
        'w-[50px] h-[70px] sm:w-[70px] sm:h-[90px] md:w-[90px] md:h-[110px]',
        isSelected && 'outline outline-[2px] outline-[#C4C4C4] outline-offset-[2px]',
        isDisabled && 'opacity-40 cursor-default'
      )}
    >
      {/* 날짜 숫자 */}
      <span
       className="relative text-sm sm:text-base md:text-lg text-gray-800 mb-1"
       >
       {date}
       {isToday && (
           <span
           className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-gray-800 rounded transition-all duration-150"
           ></span>
       )}
     </span>

      {/* 일정 목록 */}
      <div
        className="mt-1 sm:mt-2 flex flex-col gap-[2px] w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1"
            style={{
              opacity: 1 - idx * 0.15, // 아래로 갈수록 약간 희미하게
            }}
          >
            {/* 왼쪽 세로 막대 */}
            <div
              className="w-[2px] h-[10px] sm:h-[12px] md:h-[14px] rounded"
              style={{ backgroundColor: '#F38BA0' }}
            ></div>

            {/* 일정 텍스트 */}
            <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-700 leading-tight">
              {event}
            </span>
          </div>
        ))}
      </div>
    </button>
  )
}
