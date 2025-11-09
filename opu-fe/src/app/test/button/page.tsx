'use client'

import { Icon } from '@iconify/react'
import PlusButton from '@/components/common/PlusButton'

export default function TestMenuPage() {
  // 메뉴 항목 정의
  const menuOptions = [
    {
      label: '수정',
      onClick: () => alert('수정 클릭!'),
    },
    {
      label: '삭제',
      icon: <Icon icon="mdi:trash-can-outline" width={18} height={18} />,
      onClick: () => alert('삭제 클릭!'),
    },
    {
      label: '루틴 추가',
      icon: <Icon icon="mdi:plus-circle-outline" width={18} height={18} />,
      onClick: () => alert('루틴 추가 클릭!'),
    },
  ]

  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      {/* PlusButton 테스트 */}
      <PlusButton options={menuOptions} position="top-left" />
    </main>
  )
}
