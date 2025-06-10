import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'

// slug 유효성 검사 함수
function isValidSlug(slug: string) {
  // 영문 소문자, 숫자, 하이픈만 허용
  const slugRegex = /^[a-z0-9-]+$/
  // 길이는 3-20자
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 20
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const sitesRef = collection(db, 'sites')
    const q = query(sitesRef, where('slug', '==', username))
    const querySnapshot = await getDocs(q)
    
    const sites = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(sites)
  } catch (error) {
    console.error('사이트 목록 조회 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, template, slug } = body

    // 필수 필드 검증
    if (!name || !template || !slug) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 })
    }

    // slug 유효성 검사
    if (!isValidSlug(slug)) {
      return NextResponse.json({ 
        error: 'URL 주소는 영문 소문자, 숫자, 하이픈만 사용 가능하며 3-20자여야 합니다.' 
      }, { status: 400 })
    }

    // slug 중복 검사
    const sitesRef = collection(db, 'sites')
    const q = query(sitesRef, where('slug', '==', slug))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return NextResponse.json({ error: '이미 사용 중인 URL 주소입니다.' }, { status: 400 })
    }

    // 사이트 생성
    const newSite = {
      name,
      description: description || '',
      template,
      slug,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(collection(db, 'sites'), newSite)
    
    return NextResponse.json({
      id: docRef.id,
      ...newSite
    })
  } catch (error) {
    console.error('사이트 생성 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 