import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('siteId')

  if (!siteId) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 })
  }

  try {
    const eventsRef = collection(db, 'events')
    const q = query(eventsRef, where('siteId', '==', siteId))
    const querySnapshot = await getDocs(q)
    
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(events)
  } catch (error) {
    console.error('이벤트 조회 실패:', error)
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
    const eventsRef = collection(db, 'events')
    
    const newEvent = {
      siteId,
      date: data.date,
      title: data.title,
      description: data.description,
      isNotice: data.isNotice || false,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(eventsRef, newEvent)
    return NextResponse.json({ id: docRef.id, ...newEvent })
  } catch (error) {
    console.error('이벤트 생성 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    await deleteDoc(doc(db, 'events', id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('이벤트 삭제 실패:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 