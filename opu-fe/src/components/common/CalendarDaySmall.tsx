'use client'

import React from 'react'
import clsx from 'clsx'

interface CalendarDaySmallProps {
  date: number
  level: number // 0~4 단계 (투두 완료량)
}

export default function CalendarDaySmall({ date, level }: CalendarDaySmallProps) {
  // 색상 단계별 설정
  const colors = [
    'bg-gray-100',  // level 0
    'bg-[#EAF4D3]', // level 1
    'bg-[#D9E8A7]', // level 2
    'bg-[#C0DB6A]', // level 3
    'bg-[#A7CF3C]', // level 4 (가장 진함)
  ]

  return (
    <div
      className={clsx(
        'flex items-center justify-center text-[10px] sm:text-xs rounded-[6px]',
        'aspect-square w-[40px] sm:w-[50px] md:w-[60px] transition-all duration-150',
        colors[level]
      )}
    >
      {date}
    </div>
  )
}
