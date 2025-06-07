import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, query, where, addDoc } from 'firebase/firestore'

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
interface SiteInfo {
  id: string
  slug: string
  name: string
  description: string
  profileImage: string
  template: 'guestbook' | 'calendar'
  createdAt: string
}

const sites = new Map<string, SiteInfo>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('id')
  const slug = searchParams.get('slug')

  try {
    const sitesRef = collection(db, 'sites')

    if (siteId) {
      const siteDoc = await getDoc(doc(sitesRef, siteId))
      if (!siteDoc.exists()) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 })
      }
      return NextResponse.json({ id: siteDoc.id, ...siteDoc.data() })
    }

    if (slug) {
      const q = query(sitesRef, where('slug', '==', slug))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 })
      }
      
      const siteDoc = querySnapshot.docs[0]
      return NextResponse.json({ id: siteDoc.id, ...siteDoc.data() })
    }

    return NextResponse.json({ error: 'ID or slug is required' }, { status: 400 })
  } catch (error) {
    console.error('사이트 조회 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 사이트 정보 저장
    const sitesRef = collection(db, 'sites')
    const docRef = await addDoc(sitesRef, {
      slug: data.slug,
      name: data.name,
      description: data.description,
      profileImage: data.profileImage || '',
      template: data.template,
      createdAt: new Date().toISOString()
    })

    // 저장된 사이트 정보 조회
    const siteDoc = await getDoc(docRef)
    return NextResponse.json({ id: siteDoc.id, ...siteDoc.data() })
  } catch (error) {
    console.error('사이트 생성 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 