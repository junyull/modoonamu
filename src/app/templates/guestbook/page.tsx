'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SiteInfo {
  name: string
  description: string
  profileImage: string
}

interface GuestbookEntry {
  id: number
  name: string
  message: string
  createdAt: string
}

export default function GuestbookTemplate() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    name: '',
    description: '',
    profileImage: ''
  })
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 사이트 정보를 가져옵니다
  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await fetch('/api/site')
        const data = await response.json()
        setSiteInfo(data)
      } catch (error) {
        console.error('사이트 정보를 불러오는데 실패했습니다:', error)
      }
    }
    fetchSiteInfo()
  }, [])

  // 방명록 데이터를 가져옵니다
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/guestbook')
        const data = await response.json()
        setEntries(data)
      } catch (error) {
        console.error('방명록을 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEntries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          message,
        }),
      })
      const newEntry = await response.json()
      setEntries([newEntry, ...entries])
      setName('')
      setMessage('')
    } catch (error) {
      console.error('방명록 작성에 실패했습니다:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* 프로필 섹션 */}
      <div className="bg-gradient-to-b from-blue-600/20 to-transparent pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-4">
              <div className="w-full h-full rounded-full bg-zinc-700 overflow-hidden border-4 border-white/10">
                {siteInfo.profileImage ? (
                  <Image
                    src={siteInfo.profileImage}
                    alt="프로필 이미지"
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
            <h1 className="text-2xl font-bold text-white mb-2">{siteInfo.name || '방명록'}</h1>
            <p className="text-zinc-300 text-center max-w-md">
              {siteInfo.description || '방문해주신 고객님들의 소중한 한마디를 남겨주세요.'}
            </p>
          </div>
        </div>
      </div>

      {/* 방명록 작성 폼 */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-700 mb-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                이름
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름을 입력해주세요"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1">
                메시지
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="메시지를 입력해주세요"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              방명록 남기기
            </button>
          </form>
        </div>

        {/* 방명록 목록 */}
        <div className="space-y-4 mb-8">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-white">{entry.name}</span>
                <span className="text-sm text-zinc-400">{entry.createdAt}</span>
              </div>
              <p className="text-zinc-300">{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 