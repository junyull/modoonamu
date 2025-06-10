import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export const dynamic = 'force-static'
export const revalidate = 0

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
const usedSlugs = new Set<string>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  // slug 형식 검사 (영문 소문자, 숫자, 하이픈만 허용)
  const isValidSlug = /^[a-z0-9-]+$/.test(slug)
  if (!isValidSlug) {
    return NextResponse.json({ 
      available: false,
      error: '영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.'
    })
  }

  try {
    // 파이어스토어에서 slug 중복 체크
    const sitesRef = collection(db, 'sites')
    const q = query(sitesRef, where('slug', '==', slug))
    const querySnapshot = await getDocs(q)

    return NextResponse.json({ 
      available: querySnapshot.empty
    })
  } catch (error) {
    console.error('Slug 중복 체크 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 새로운 slug 등록
export async function POST(request: Request) {
  const { slug } = await request.json()
  
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  if (usedSlugs.has(slug)) {
    return NextResponse.json({ error: 'Slug is already taken' }, { status: 400 })
  }

  usedSlugs.add(slug)
  return NextResponse.json({ success: true })
} 