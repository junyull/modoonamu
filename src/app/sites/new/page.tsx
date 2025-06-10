'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'

export default function NewSitePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [template, setTemplate] = useState('calendar') // 기본값 calendar
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/login')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          template,
          userId: user.uid
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '사이트 생성에 실패했습니다.')
      }

      router.push('/dashboard')
    } catch (error: any) {
      console.error('사이트 생성 중 오류가 발생했습니다:', error)
      setError(error.message || '사이트를 생성하는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">새 사이트 만들기</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-500 p-4">
              <p className="text-white text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              사이트 이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="나의 멋진 사이트"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-300 mb-2">
              URL 주소
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-zinc-500">modoonamu.vercel.app/</span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="my-site"
                pattern="[a-z0-9-]{3,20}"
                title="영문 소문자, 숫자, 하이픈만 사용 가능하며 3-20자여야 합니다"
                required
              />
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              영문 소문자, 숫자, 하이픈만 사용 가능하며 3-20자여야 합니다
            </p>
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-zinc-300 mb-2">
              템플릿 선택
            </label>
            <select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="calendar">일정표</option>
              <option value="guestbook">방명록</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="사이트에 대한 간단한 설명을 입력해주세요"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '생성 중...' : '사이트 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 