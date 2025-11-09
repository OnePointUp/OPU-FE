'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import FloatingMenu from './FloatingMenu'

// 메뉴에게 전달할 것들
interface MenuOption {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
}

// 부모에게 받은 것
interface PlusButtonProps {
  options: MenuOption[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

// 버튼
export default function PlusButton({ options, position = 'top-left' }: PlusButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="relative">
      {/* 플러스 버튼 */}
      <button
        onClick={toggleMenu}
        className="w-15 h-15 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: '#FFB6C5' }}
      >
        <Icon icon="mdi:plus" width={28} height={28} className="text-white" />
      </button>

      {/* 메뉴 */}
      <FloatingMenu isOpen={isOpen} onClose={closeMenu} options={options} position={position} />
    </div>
  )
}
