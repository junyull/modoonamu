import { NextResponse } from 'next/server'

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용해야 합니다)
let events = [
  {
    id: 1,
    date: new Date(2024, 2, 25).toISOString(),
    title: "3월 정기 모임",
    description: "오후 2시, 커뮤니티 센터에서 정기 모임이 있습니다.",
    isNotice: true
  },
  {
    id: 2,
    date: new Date(2024, 2, 28).toISOString(),
    title: "봄맞이 대청소",
    description: "전체 구성원이 참여하는 봄맞이 대청소가 진행됩니다.",
    isNotice: true
  }
]

export async function GET() {
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const event = await request.json()
  const newEvent = {
    id: events.length + 1,
    ...event,
    date: new Date(event.date).toISOString()
  }
  events.push(newEvent)
  return NextResponse.json(newEvent)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  events = events.filter(event => event.id !== id)
  return NextResponse.json({ success: true })
} 