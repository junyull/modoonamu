import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

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