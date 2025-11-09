'use client'

import {ReactNode, useRef, useEffect} from 'react'

interface MenuOption {
    label: string
    icon?: ReactNode
    onClick?: () => void
}

interface FloatingMenuProps {
  isOpen: boolean
  onClose: () => void
  options: MenuOption[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export default function FloatingMenu({
  isOpen,
  onClose,
  options,
  position = 'top-left',
}: FloatingMenuProps) {
    const menuRef = useRef<HTMLDivElement | null>(null)

    // 메뉴 밖 클릭 시 메뉴 닫힘
    useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
        }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    // 메뉴 위치 계산
    const positionClass = {
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    }[position]

    // 메뉴 안 열려있으면 렌더 x
    if (!isOpen) return null

    // 렌더링
  return (
    <div
      ref={menuRef}
      className={`absolute ${positionClass} z-50 w-fix min-w-max rounded-xl border border-gray-100 bg-white shadow-lg`}
    >
      <ul className="flex flex-col py-1">
        {options.map((opt, index) => (
          <li
            key={opt.label}
            onClick={() => {
              opt.onClick?.()
              onClose()
            }}
            className={`
              flex items-center gap-9 px-3 py-2 text-sm font-medium
              transition-colors duration-150 cursor-pointer
              ${!opt.icon ? 'justify-center' : 'justify-between'}
              ${index !== 0 ? 'border-t border-gray-200' : ''}
            `}
          >
            <span>{opt.label}</span>
            {opt.icon && (
              <span className="w-4 h-4 flex items-center justify-center">{opt.icon}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}