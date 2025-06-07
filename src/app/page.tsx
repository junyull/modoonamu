'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UseCaseCarousel from './components/UseCaseCarousel'
import { isLoggedIn } from './utils/auth'
import Image from 'next/image'

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
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        나만의 링크 페이지를
        <br />
        만들어보세요
      </h1>
      
      <div className="flex gap-4 mt-8">
        <Link
          href="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          새 사이트 만들기
        </Link>
        <Link
          href="/demo"
          className="px-6 py-3 bg-zinc-800 text-white rounded-full font-medium hover:bg-zinc-700 transition-colors"
        >
          데모 사이트 보기
        </Link>
      </div>

      <UseCaseCarousel />
    </div>
  )
}
