'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

interface Site {
  id: string
  name: string
  description: string
  profileImage: string
  template: 'guestbook' | 'calendar'
  createdAt: string
}

export default function MySites() {
  const router = useRouter()
  const { user } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/my-sites')
      return
    }

    const fetchMySites = async () => {
      try {
        const response = await fetch(`/api/sites?username=${user.username}`)
        if (!response.ok) {
          throw new Error('사이트 목록을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setSites(data)
      } catch (error) {
        console.error('사이트 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMySites()
  }, [user, router])

  if (!user) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">내 사이트</h1>
            <button
              onClick={() => router.push('/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              새 사이트 만들기
            </button>
          </div>

          {sites.length === 0 ? (
            <div className="bg-zinc-800 rounded-2xl p-8 text-center border border-zinc-700">
              <p className="text-zinc-400 mb-4">아직 만든 사이트가 없습니다.</p>
              <button
                onClick={() => router.push('/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                첫 사이트 만들기
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-zinc-700 overflow-hidden border-4 border-white/10">
                        {site.profileImage ? (
                          <Image
                            src={site.profileImage}
                            alt={site.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-zinc-400 text-sm">이미지 없음</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-white mb-2">{site.name}</h2>
                      <p className="text-zinc-400 mb-4">{site.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">
                          템플릿: {site.template === 'guestbook' ? '방명록' : '월 일정표'}
                        </span>
                        <span className="text-sm text-zinc-500">
                          생성일: {new Date(site.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/templates/${site.template}?site=${site.id}`)}
                      className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                    >
                      사이트 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 