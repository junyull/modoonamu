'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const redirect = searchParams.get('redirect')
      router.push(redirect || '/')
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 주소입니다.')
          break
        case 'auth/user-disabled':
          setError('해당 계정은 비활성화되었습니다.')
          break
        case 'auth/user-not-found':
          setError('해당 이메일로 등록된 계정이 없습니다.')
          break
        case 'auth/wrong-password':
          setError('잘못된 비밀번호입니다.')
          break
        default:
          setError('로그인 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-xl border border-zinc-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">로그인</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500 p-4">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
} 