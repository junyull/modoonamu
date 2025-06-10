'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateSite() {
  const router = useRouter()
  const { user } = useAuth()
  const [siteName, setSiteName] = useState('')
  const [description, setDescription] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [template, setTemplate] = useState<'guestbook' | 'calendar' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/create')
    }
  }, [user, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!template) {
      alert('템플릿을 선택해주세요.')
      return
    }

    if (!user?.username) {
      alert('사용자 정보를 불러올 수 없습니다.')
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: siteName,
          description,
          profileImage,
          template,
          slug: user.username
        }),
      })

      if (!response.ok) {
        throw new Error('사이트 생성에 실패했습니다.')
      }
      
      const site = await response.json()
      if (template === 'guestbook') {
        router.push(`/templates/guestbook?site=${site.id}`)
      } else if (template === 'calendar') {
        router.push(`/templates/calendar?site=${site.id}`)
      }
    } catch (error) {
      console.error('사이트 생성에 실패했습니다:', error)
      alert('사이트 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">새 사이트 만들기</h1>
          
          <div className="bg-zinc-800 rounded-2xl p-6 shadow-xl border border-zinc-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-4">
                  프로필 이미지
                </label>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="w-full h-full rounded-full bg-zinc-700 overflow-hidden border-4 border-white/10">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="프로필 이미지"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <label 
                            htmlFor="profileUpload"
                            className="text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors text-sm text-center p-2"
                          >
                            클릭하여<br/>이미지 업로드
                          </label>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="profileUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* 사이트 이름 */}
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-zinc-300 mb-1">
                  사이트 이름
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사이트 이름을 입력하세요"
                  required
                />
              </div>

              {/* 사이트 설명 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                  사이트 설명
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사이트에 대한 설명을 입력하세요"
                  required
                />
              </div>

              {/* 템플릿 선택 */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-4">
                  템플릿 선택
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* 방명록 템플릿 */}
                  <button
                    type="button"
                    onClick={() => setTemplate('guestbook')}
                    className={`
                      p-4 rounded-xl text-left transition-all
                      ${template === 'guestbook'
                        ? 'bg-blue-500/10 border-2 border-blue-500'
                        : 'bg-zinc-900 border border-zinc-700 hover:border-zinc-600'
                      }
                    `}
                  >
                    <h3 className="text-white font-medium mb-2">방명록</h3>
                    <p className="text-sm text-zinc-400">
                      방문자들이 남기는 소중한 메시지를 기록하세요.
                    </p>
                  </button>

                  {/* 일정표 템플릿 */}
                  <button
                    type="button"
                    onClick={() => setTemplate('calendar')}
                    className={`
                      p-4 rounded-xl text-left transition-all
                      ${template === 'calendar'
                        ? 'bg-blue-500/10 border-2 border-blue-500'
                        : 'bg-zinc-900 border border-zinc-700 hover:border-zinc-600'
                      }
                    `}
                  >
                    <h3 className="text-white font-medium mb-2">월 일정표</h3>
                    <p className="text-sm text-zinc-400">
                      달력으로 일정을 관리하고 공지사항을 공유하세요.
                    </p>
                  </button>
                </div>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isLoading || !template}
                className={`
                  w-full py-3 rounded-lg font-medium
                  ${isLoading || !template
                    ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                  transition-colors
                `}
              >
                {isLoading ? '생성 중...' : '사이트 만들기'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 