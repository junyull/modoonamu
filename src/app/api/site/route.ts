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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 })
  }

  try {
    const siteRef = doc(db, 'sites', id)
    const siteSnap = await getDoc(siteRef)

    if (!siteSnap.exists()) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: siteSnap.id,
      ...siteSnap.data()
    })
  } catch (error) {
    console.error('사이트 정보 조회 실패:', error)
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