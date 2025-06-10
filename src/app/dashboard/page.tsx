'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Site = {
  id: string
  name: string
  slug: string
  description: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchSites = async () => {
      try {
        const sitesRef = collection(db, 'sites')
        const q = query(sitesRef, where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q)
        
        const sitesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Site[]
        
        setSites(sitesData)
      } catch (error) {
        console.error('사이트 목록을 불러오는 중 오류가 발생했습니다:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [user, router])

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">내 사이트</h1>
        <button
          onClick={() => router.push('/sites/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          새 사이트 만들기
        </button>
      </div>

      {loading ? (
        <div className="text-center text-zinc-400">로딩 중...</div>
      ) : sites.length === 0 ? (
        <div className="text-center text-zinc-400">
          아직 생성된 사이트가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{site.name}</h2>
              <p className="text-zinc-400 mb-4">{site.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">/{site.slug}</span>
                <button
                  onClick={() => router.push(`/sites/${site.id}`)}
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  관리하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 