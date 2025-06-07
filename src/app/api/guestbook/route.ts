import { NextResponse } from 'next/server'

// 임시 데이터 저장소
const entries = new Map<string, {
  id: string
  name: string
  message: string
  createdAt: string
}>()

export async function GET() {
  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const entry = await request.json()
  const newEntry = {
    id: entries.length + 1,
    ...entry,
    createdAt: new Date().toLocaleString()
  }
  entries.unshift(newEntry)
  return NextResponse.json(newEntry)
} 