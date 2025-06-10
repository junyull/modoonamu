'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  const checkUsername = async (value: string) => {
    if (!value) {
      setIsUsernameAvailable(false)
      return
    }

    setIsCheckingUsername(true)
    try {
      const docRef = doc(db, 'usernames', value)
      const docSnap = await getDoc(docRef)
      setIsUsernameAvailable(!docSnap.exists())
    } catch (error) {
      console.error('아이디 중복 체크 실패:', error)
      setIsUsernameAvailable(false)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
    setUsername(value)
    checkUsername(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!isUsernameAvailable) {
      setError('사용할 수 없는 아이디입니다.')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // 아이디 예약
      await setDoc(doc(db, 'usernames', username), {
        uid: userCredential.user.uid
      })

      // 사용자 추가 정보 저장
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        username,
        createdAt: new Date().toISOString()
      })
      
      router.push('/login')
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('이미 사용 중인 이메일입니다.')
          break
        case 'auth/invalid-email':
          setError('유효하지 않은 이메일 주소입니다.')
          break
        case 'auth/operation-not-allowed':
          setError('이메일/비밀번호 회원가입이 비활성화되어 있습니다.')
          break
        case 'auth/weak-password':
          setError('비밀번호는 6자 이상이어야 합니다.')
          break
        default:
          setError('회원가입 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-xl border border-zinc-700">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">회원가입</h2>
        
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
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
              아이디 (영문, 숫자만 가능)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              className={`w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                username ? (isUsernameAvailable ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-zinc-700 focus:ring-blue-500'
              }`}
              placeholder="영문, 숫자로 입력해주세요"
              pattern="[a-z0-9]+"
              required
            />
            {username && (
              <p className={`mt-1 text-sm ${isUsernameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                {isCheckingUsername ? '확인 중...' : (isUsernameAvailable ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')}
              </p>
            )}
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
            disabled={!isUsernameAvailable || isCheckingUsername}
            className={`w-full py-3 rounded-lg font-medium ${
              !isUsernameAvailable || isCheckingUsername
                ? 'bg-blue-600/50 text-white/50 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  )
} 