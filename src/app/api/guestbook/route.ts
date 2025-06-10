import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'

interface GuestbookEntry {
  id: string
  siteId: string
  name: string
  message: string
  createdAt: string
}

const entries: GuestbookEntry[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('siteId')

  if (!siteId) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 })
  }

  try {
    const entriesRef = collection(db, 'guestbook')
    const q = query(entriesRef, where('siteId', '==', siteId))
    const querySnapshot = await getDocs(q)
    
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(entries)
  } catch (error) {
    console.error('방명록 조회 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('siteId')

  if (!siteId) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 })
  }

  try {
    const data = await request.json()
    const entriesRef = collection(db, 'guestbook')
    
    const newEntry = {
      siteId,
      name: data.name,
      message: data.message,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(entriesRef, newEntry)
    return NextResponse.json({ id: docRef.id, ...newEntry })
  } catch (error) {
    console.error('방명록 작성 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 