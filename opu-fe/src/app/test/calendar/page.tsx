'use client'

import React, { useState } from 'react'
import CalendarDayLarge from '@/components/common/CalendarDayLarge'
import CalendarDaySmall from '@/components/common/CalendarDaySmall'
import { Icon } from '@iconify/react'

export default function CalendarTestPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [compact, setCompact] = useState(false)

  // 테스트용 날짜 데이터
  const days = Array.from({ length: 30 }, (_, i) => ({
    date: i + 1,
    events: [
      '회의',
      '개발 일정',
      '리뷰',
      '커피챗',
      '운동',
      '스터디',
      '프로젝트 미팅',
    ].slice(0, Math.floor(Math.random() * 5) + 1),
  }))

  // 투두 완료 단계 (0~4)
  const todoLevels = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 5)
  )

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-10 bg-white transition-all duration-500">
      <h1 className="text-2xl font-bold mb-6">🗓️ CalendarDay 전환 테스트</h1>

      {/* 캘린더 컨테이너 */}
      <div
        className="grid grid-cols-7 gap-[6px] transition-all duration-700 ease-in-out"
        style={{
          width: 'fit-content',
        }}
      >
        {days.map((d, i) => (
          <div
            key={d.date}
            className="relative flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{
              width: compact ? '40px' : '90px',
              height: compact ? '40px' : '110px',
              transition: 'all 0.5s ease-in-out',
            }}
          >
            {/* 큰 캘린더 셀 (점점 사라짐) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                compact
                  ? 'opacity-0 scale-75 pointer-events-none'
                  : 'opacity-100 scale-100'
              }`}
            >
              <CalendarDayLarge
                date={d.date}
                events={d.events}
                isToday={d.date === 9}
                isSelected={selected === d.date}
                onClick={() => setSelected(d.date)}
              />
            </div>

            {/* 작은 캘린더 셀 (점점 나타남) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                compact
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-75 pointer-events-none'
              }`}
            >
              <CalendarDaySmall date={d.date} level={todoLevels[i]} />
            </div>
          </div>
        ))}
      </div>

      {/* 🔼 전환 버튼 */}
      <button
        onClick={() => setCompact((prev) => !prev)}
        className="mt-6 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <Icon
          icon={compact ? 'mdi:chevron-down' : 'mdi:chevron-up'}
          width="20"
          height="20"
        />
        <span>{compact ? '큰 캘린더 보기' : '작은 캘린더 보기'}</span>
      </button>

      <p className="mt-6 text-gray-600 text-sm">
        선택된 날짜: {selected ? `${selected}일` : '없음'}
      </p>
    </main>
  )
}
