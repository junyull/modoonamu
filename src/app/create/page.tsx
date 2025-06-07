'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { debounce } from 'lodash'

export default function CreateSite() {
  const router = useRouter()
  const [siteName, setSiteName] = useState('')
  const [description, setDescription] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [template, setTemplate] = useState<'guestbook' | 'calendar' | null>(null)
  const [slug, setSlug] = useState('')
  const [slugError, setSlugError] = useState<string | null>(null)
  const [isSlugAvailable, setIsSlugAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // slug 자동 생성
  useEffect(() => {
    if (siteName && !slug) {
      const generatedSlug = siteName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // 영문 소문자, 숫자가 아닌 문자를 하이픈으로 변경
        .replace(/-+/g, '-') // 연속된 하이픈을 하나로 합침
        .replace(/^-|-$/g, '') // 시작과 끝의 하이픈 제거
      setSlug(generatedSlug)
    }
  }, [siteName, slug])

  // slug 중복 체크
  const checkSlug = debounce(async (value: string) => {
    if (!value) {
      setSlugError(null)
      setIsSlugAvailable(false)
      return
    }

    try {
      const response = await fetch(`/api/site/check-slug?slug=${value}`)
      const data = await response.json()

      if (!data.available) {
        setSlugError(data.error || '이미 사용 중인 주소입니다.')
        setIsSlugAvailable(false)
      } else {
        setSlugError(null)
        setIsSlugAvailable(true)
      }
    } catch (error) {
      console.error('URL 중복 체크 실패:', error)
      setSlugError('URL 중복 체크에 실패했습니다.')
      setIsSlugAvailable(false)
    }
  }, 500)

  // slug 변경 시 중복 체크
  useEffect(() => {
    if (slug) {
      checkSlug(slug)
    }
  }, [slug])

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
    if (!isSlugAvailable) {
      alert('사용할 수 없는 URL입니다.')
      return
    }
    
    setIsLoading(true)

    try {
      // slug 등록
      await fetch('/api/site/check-slug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })

      // 사이트 정보 저장
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
          slug,
        }),
      })
      
      const site = await response.json()
      // 생성된 사이트로 이동
      router.push(`/sites/${site.id}`)
    } catch (error) {
      console.error('사이트 생성에 실패했습니다:', error)
      alert('사이트 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

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

              {/* URL 주소 */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-zinc-300 mb-1">
                  URL 주소
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-400">sites/</span>
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    className={`
                      flex-1 px-4 py-2 bg-zinc-900 border rounded-lg text-white focus:outline-none focus:ring-2
                      ${slugError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : isSlugAvailable 
                          ? 'border-green-500 focus:ring-green-500' 
                          : 'border-zinc-700 focus:ring-blue-500'
                      }
                    `}
                    placeholder="my-site"
                    pattern="[a-z0-9-]+"
                    required
                  />
                </div>
                {slugError && (
                  <p className="mt-1 text-sm text-red-500">{slugError}</p>
                )}
                {isSlugAvailable && (
                  <p className="mt-1 text-sm text-green-500">사용 가능한 주소입니다.</p>
                )}
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
                disabled={isLoading || !template || !isSlugAvailable}
                className={`
                  w-full py-3 rounded-lg font-medium
                  ${isLoading || !template || !isSlugAvailable
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