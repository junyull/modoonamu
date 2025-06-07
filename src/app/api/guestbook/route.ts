import { NextResponse } from 'next/server'

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let entries = [
  {
    id: 1,
    name: "김모두",
    message: "좋은 하루 보내세요! 😊",
    createdAt: "2024-03-20 14:30"
  },
  {
    id: 2,
    name: "이나무",
    message: "항상 응원합니다! 💪",
    createdAt: "2024-03-20 15:45"
  }
]

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