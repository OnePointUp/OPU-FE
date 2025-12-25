'use client'

import { Icon } from "@iconify/react"

interface SocialLoginButtonProps {
    provider: 'kakao' | 'google'
    onClick: () => void
}

export default function SocialLoginButton({provider, onClick}: SocialLoginButtonProps) {
    const config = {
        kakao: {
        label: '카카오로 시작하기',
        bg: 'var(--color-kakao-yellow)',
        text: 'var(--color-dark-navy)',
        border: 'var(--color-kakao-yellow)',
        hover: 'hover:brightness-95',
        icon: 'fa7-brands:kakao-talk',
        },
        google: {
        label: 'Google로 시작하기',
        bg: 'white',
        text: 'var(--color-dark-navy)',
        border: 'var(--color-super-light-gray)',
        hover: 'hover:bg-[var(--color-super-light-gray)]',
        icon: 'material-icon-theme:google',
        },
    }[provider]

    return (
        <button
        onClick={onClick}
        style={{
            backgroundColor: config.bg,
            color: config.text,
            borderColor: config.border,
        }}
        className="flex items-center justify-center gap-2 w-[min(90%,355px)] h-[50px] rounded-[6px] font-semibold transition-all border hover:brightness-95 cursor-pointer"
        >
        <Icon icon={config.icon} width={20} height={20} />
        {config.label}
        </button>
    )
}