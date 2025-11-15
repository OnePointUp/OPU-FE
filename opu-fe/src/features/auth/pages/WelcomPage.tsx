'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SocialLoginButton from '@/features/auth/components/SocialLoginButton'

export default function IntroPage() {
  const router = useRouter()

  return (
    <div className="app-page app-container flex flex-col justify-between max-h-screen py-10">
      {/* ---------- 상단: 로고 & 문구 ---------- */}
      <header className="flex flex-col items-center mt-20 text-center">
        <h1 className="text-h1 font-bold text-[color:var(--color-dark-navy)] text-[length:var(--text-h1)]">OPU</h1>
        <p className="text-sub text-[var(--color-dark-gray)] mt-[33px]">
          One Point Up!<br/>
          한 걸음씩, 오늘도 나아가기
        </p>
      </header>

      {/* ---------- 중앙: 캐릭터 ---------- */}
      <section className="flex justify-center my-10">
        <Image
          src="/images/cabit_hello.png"
          alt="OPU mascot"
          width={230}
          height={230}
          priority
        />
      </section>

      {/* ---------- 하단: 버튼 영역 ---------- */}
      <footer className="flex flex-col gap-[14px] items-center w-full mb-10">
        <SocialLoginButton provider="kakao" onClick={() => alert('카카오 로그인 클릭')} />
        <SocialLoginButton provider="google" onClick={() => alert('구글 로그인 클릭')} />

        {/* 이메일 로그인 / 회원가입 */}
        <div className="text-center text-[length:var(--text-caption)] text-[color:var(--color-light-gray)] mt-[7px]">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push('/login')}
          >
            이메일로 로그인
          </span>
          {'  |  '}
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push('/signup')}
          >
            회원가입
          </span>
        </div>
      </footer>
    </div>
  )
}
