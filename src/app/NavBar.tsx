'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function NavBar() {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error)
    }
  }

  return (
    <nav className="bg-zinc-900 shadow-lg border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white hover:text-zinc-200 transition-colors">
          모두트리
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <button 
                onClick={handleLogout}
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                로그인
              </Link>
              <Link 
                href="/signup" 
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 