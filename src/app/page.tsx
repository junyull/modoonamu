'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UseCaseCarousel from './components/UseCaseCarousel'
import { isLoggedIn } from './utils/auth'

export default function Home() {
  const router = useRouter()

  const handleCreateClick = () => {
    if (isLoggedIn()) {
      router.push('/create')
    } else {
      router.push('/login?redirect=/create')
    }
  }

  const handleMySitesClick = () => {
    if (isLoggedIn()) {
      router.push('/my-sites')
    } else {
      router.push('/login?redirect=/my-sites')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">모두트리</h1>
        <p className="text-lg text-white/80 mb-10">모두트리는 대한민국 5,500만명에게<br />
        작지만 의미 있는 한페이지를 선물합니다.</p>
        
        <div className="grid gap-3 w-full max-w-sm mx-auto mb-16">
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-center text-[15px] hover:bg-blue-700 transition-colors backdrop-blur-sm border border-blue-500/30">
            내 사이트 만들기
          </button>
          
          <button
            onClick={handleMySitesClick}
            className="bg-sky-500 text-white px-6 py-3.5 rounded-2xl text-center text-[15px] hover:bg-sky-600 transition-colors backdrop-blur-sm border border-sky-400/30">
            내 사이트 보기
          </button>
        </div>
      </div>

      <UseCaseCarousel />
    </div>
  )
}
