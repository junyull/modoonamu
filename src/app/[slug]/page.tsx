'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface SiteInfo {
  id: string
  name: string
  slug: string
  template: string
}

export default function SiteRedirect() {
  const { slug } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function redirectToSite() {
      try {
        // slug로 사이트 정보 조회
        const siteRef = doc(db, 'sites', slug as string)
        const siteSnap = await getDoc(siteRef)
        
        if (siteSnap.exists()) {
          const siteData = siteSnap.data() as SiteInfo
          // 템플릿 페이지로 리디렉션
          window.location.href = `/templates/${siteData.template}?site=${siteData.id}`
        } else {
          // 사이트를 찾을 수 없는 경우
          window.location.href = '/404'
        }
      } catch (error) {
        console.error('Error:', error)
        window.location.href = '/404'
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      redirectToSite()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return null
} 