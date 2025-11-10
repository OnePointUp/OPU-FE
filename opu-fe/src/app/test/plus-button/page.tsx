'use client'

import PlusButton from '@/components/common/PlusButton'

export default function PlusButtonTestPage() {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--color-super-light-gray)',
      }}
    >

      {/* 플러스 버튼: main 내부 오른쪽 하단 */}
      <div
        style={{
          position: 'absolute',
          right: '24px',
          bottom: '24px',
        }}
      >
        <PlusButton />
      </div>
    </main>
  )
}
